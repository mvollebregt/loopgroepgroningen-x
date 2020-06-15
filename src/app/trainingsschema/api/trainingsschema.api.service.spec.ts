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
  const config: TrainingsschemaConfiguration = Object.fromEntries(props.map(prop => [`Column name of ${prop}`, prop]));
  const columnNames = Object.keys(config);

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

    const response = createResponse('training 1', 'training 2');
    service.fetchTrainingsschemaConfiguration = jest.fn(() => of(config));

    service.fetchTrainingsschema().subscribe(trainingsschema => {
      expect(trainingsschema).toEqual([{
        week: 'Value of week for training 1',
        dag: 'Value of dag for training 1',
        groep: 'Value of groep for training 1',
        datum: 'Value of datum for training 1',
        omschrijving: 'Value of omschrijving for training 1',
        locatie: 'Value of locatie for training 1',
        type: 'Value of type for training 1'
      }, {
        week: 'Value of week for training 2',
        dag: 'Value of dag for training 2',
        groep: 'Value of groep for training 2',
        datum: 'Value of datum for training 2',
        omschrijving: 'Value of omschrijving for training 2',
        locatie: 'Value of locatie for training 2',
        type: 'Value of type for training 2'
      }]);
      done();
    });

    const request = httpTestingController.expectOne(
      `${TrainingsschemaApiService.baseApiUrl}${TrainingsschemaApiService.trainingsschemaUrl}`);
    request.flush(response);
  });

  function createResponse(...trainingen: string[]): TrainingsschemaApiResponse {
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
          createElements('td', props.map(prop => `Value of ${prop} for ${training}`))))}
            </tbody>
          </table>`
      }
    };
  }

  function createElements(tag: string, contents: string[]) {
    return contents.map(content => `<${tag}>${content}</${tag}>`).join('\n');
  }
});
