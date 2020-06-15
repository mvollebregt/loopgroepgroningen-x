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
    params: {dateFormat: 'd-M-y', groep: 'groep'}
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
    service.fetchTrainingsschemaConfiguration = jest.fn();
  });

  it('Should parse the trainingsschema', done => {

    const response = createResponse({omschrijving: 'training 1'}, {omschrijving: 'training 2'});
    service.fetchTrainingsschemaConfiguration = jest.fn(() => of(config));

    service.fetchTrainingsschema().subscribe(trainingsschema => {
      expect(trainingsschema).toEqual([{
        week: 'Value of week for training 1',
        dag: 'Value of dag for training 1',
        groep: 'Value of groep for training 1',
        datum: null,
        omschrijving: 'training 1',
        locatie: 'Value of locatie for training 1',
        type: 'Value of type for training 1'
      }, {
        week: 'Value of week for training 2',
        dag: 'Value of dag for training 2',
        groep: 'Value of groep for training 2',
        datum: null,
        omschrijving: 'training 2',
        locatie: 'Value of locatie for training 2',
        type: 'Value of type for training 2'
      }]);
      done();
    });

    const request = httpTestingController.expectOne(
      `${TrainingsschemaApiService.baseApiUrl}${TrainingsschemaApiService.trainingsschemaUrl}`);
    request.flush(response);
  });

  it('Should parse dates', done => {

    const response = createResponse({omschrijving: 'training', datum: '13-7-1976'});
    service.fetchTrainingsschemaConfiguration = jest.fn(() => of(config));

    service.fetchTrainingsschema().subscribe(trainingsschema => {
      expect(trainingsschema.map(training => training.datum)).toEqual(['1976-07-13']);
      done();
    });

    const request = httpTestingController.expectOne(
      `${TrainingsschemaApiService.baseApiUrl}${TrainingsschemaApiService.trainingsschemaUrl}`);
    request.flush(response);

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
});
