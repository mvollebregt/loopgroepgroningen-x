import {TestBed} from '@angular/core/testing';

import {TrainingsschemaApiService} from './trainingsschema.api.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';
import {TrainingsschemaApiResponse} from './trainingsschema.api.response';
import {TrainingsschemaConfiguration} from './trainingsschema.configuration';
import {Training} from '../model/training';
import {of} from 'rxjs';

describe('TrainingsschemaApiService', () => {

  const props: (keyof Training)[] = ['week', 'dag', 'groep', 'datum', 'omschrijving', 'locatie', 'type'];
  const config: TrainingsschemaConfiguration = {
    columns: Object.fromEntries(props.map(prop => [`Column name of ${prop}`, prop])),
    params: {dateFormat: 'd-M-y', groepRemoveSubstrings: ['groep']}
  };
  const columnNames = Object.keys(config.columns);

  let service: TrainingsschemaApiService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientTestingModule]});
    service = TestBed.inject(TrainingsschemaApiService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service.fetchTrainingsschemaConfiguration = jest.fn(() => of(config));
  });

  it('Should parse the trainingsschema', done => {
    const response = createResponse(
      {omschrijving: 'training 1', groep: 'A'},
      {omschrijving: 'training 2', groep: 'B'});
    service.fetchTrainingsschema().subscribe(trainingsschema => {
      expect(trainingsschema).toEqual([{
        week: 'Value of week for training 1',
        dag: 'Value of dag for training 1',
        groep: 'A',
        datum: null,
        omschrijving: 'training 1',
        locatie: 'Value of locatie for training 1',
        type: 'Value of type for training 1'
      }, {
        week: 'Value of week for training 2',
        dag: 'Value of dag for training 2',
        groep: 'B',
        datum: null,
        omschrijving: 'training 2',
        locatie: 'Value of locatie for training 2',
        type: 'Value of type for training 2'
      }]);
      done();
    });
    flushResponse(response);
  });

  it('Should parse dates', done => {
    const response = createResponse({omschrijving: 'training', datum: '13-7-1976'});
    service.fetchTrainingsschema().subscribe(trainingsschema => {
      expect(trainingsschema.map(training => training.datum)).toEqual(['1976-07-13']);
      done();
    });
    flushResponse(response);
  });

  it('should parse the groep', done => {
    const response = createResponse({omschrijving: 'training', groep: 'B-groep'});
    service.fetchTrainingsschema().subscribe(trainingsschema => {
      expect(trainingsschema.map(training => training.groep)).toEqual(['B']);
      done();
    });
    flushResponse(response);
  });

  it('Should sort by datum and groep', done => {
    const response = createResponse(
      {omschrijving: 'training 3', datum: '13-7-1976', groep: 'A'},
      {omschrijving: 'training 2', datum: '14-6-1976', groep: 'B'},
      {omschrijving: 'training 1', datum: '14-6-1976', groep: 'A'},
      {omschrijving: 'training 4', datum: '13-7-1976', groep: 'B'});
    service.fetchTrainingsschema().subscribe(trainingsschema => {
      expect(trainingsschema.map(training => training.omschrijving))
        .toEqual(['training 1', 'training 2', 'training 3', 'training 4']);
      done();
    });
    flushResponse(response);
  });

  function createResponse(...trainingen: Partial<Training>[]): TrainingsschemaApiResponse {
    return {
      content: {
        rendered: `
          <table>
            <thead>
              <tr>
                ${createElements('th', columnNames)}
              </tr>
            </thead>
            <tbody>
              ${createElements('tr', trainingen.map(training =>
          createElements('td', props.map(prop => training[prop] || `Value of ${prop} for ${training.omschrijving}`))))}
            </tbody>
          </table>`
      }
    };
  }

  function createElements(tag: string, contents: string[]) {
    return contents.map(content => `<${tag}>${content}</${tag}>`).join('\n');
  }

  function flushResponse(response: TrainingsschemaApiResponse) {
    const request = httpTestingController.expectOne(
      `${TrainingsschemaApiService.baseApiUrl}${TrainingsschemaApiService.trainingsschemaUrl}`);
    request.flush(response);
  }
});
