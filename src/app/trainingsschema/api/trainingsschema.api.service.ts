import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {TrainingsschemaApiResponse} from './trainingsschema.api.response';
import {combineLatest, Observable} from 'rxjs';
import {Trainingsschema} from '../model/trainingsschema';
import {TrainingsschemaConfiguration} from './trainingsschema.configuration';
import {Training} from '../model/training';
import {normalizeString} from '../../shared/string-utils';
import {DateTime} from 'luxon';

@Injectable({
  providedIn: 'root'
})
export class TrainingsschemaApiService {

  static readonly baseApiUrl = 'http://nieuwesite.loopgroepgroningen.nl/wp-json/wp/v2/';
  static readonly trainingsschemaUrl = 'pages/185';

  constructor(private http: HttpClient) {
  }

  /**
   * Fetches the trainingsschema.
   */
  fetchTrainingsschema(): Observable<Trainingsschema> {
    return combineLatest([
      this.fetchTrainingsschemaConfiguration(),
      this.http.get<TrainingsschemaApiResponse>(
        `${TrainingsschemaApiService.baseApiUrl}${TrainingsschemaApiService.trainingsschemaUrl}`)
    ]).pipe(map(([config, response]) => {
      const parser = new DOMParser();
      const document = parser.parseFromString(response.content.rendered, 'text/html');
      const headers = document.querySelectorAll('thead th');
      const propertyIndexes = TrainingsschemaApiService.propertyIndexes(config, headers);
      const rows = document.querySelectorAll('tbody tr');
      return TrainingsschemaApiService.trainingen(config, propertyIndexes, rows);
    }));
  }

  /**
   * Fetches the trainingsschema configuration.
   * The trainingsschema configuration maps the column names in the HTML to property names of the Training-object.
   * When running locally, the configuration is read from the assets folder. When running as a real app, the configuration is read from
   * the github repo.
   */
  fetchTrainingsschemaConfiguration(): Observable<TrainingsschemaConfiguration> {
    return null as unknown as Observable<TrainingsschemaConfiguration>;
  }

  /**
   * Determines the index in the HTML of each of the properties of the Training-object, based on the trainingsschema configuration, and the
   * header titles that were read from the HTML.
   */
  private static propertyIndexes(config: TrainingsschemaConfiguration, headers: NodeListOf<Element>): [keyof Training, number][] {
    const headerToProperty = Object.fromEntries(
      Object.entries(config.columns).map(([key, value]) => [normalizeString(key), value])
    );
    const indexes: [keyof Training, number][] = [];
    for (let i = 0; i < headers.length; i++) {
      const header = normalizeString(headers.item(i).textContent);
      const property = header && headerToProperty[header];
      if (property) {
        indexes.push([property, i]);
      }
    }
    return indexes;
  }

  /**
   * Translates the data in the HTML table into a list of Training-objects, based on the property indexes determined earlier.
   */
  private static trainingen(config: TrainingsschemaConfiguration,
                            propertyIndexes: [keyof Training, number][],
                            rows: NodeListOf<Element>): Training[] {
    const result: Training[] = [];
    for (let i = 0; i < rows.length; i++) {
      const training: Partial<Training> = {};
      const columns = rows.item(i).querySelectorAll('td');
      for (const [property, index] of propertyIndexes) {
        const textContent = columns.item(index).textContent;
        if (textContent) {
          training[property] = TrainingsschemaApiService.transform(property, textContent, config);
        }
      }
      result.push(training as Training);
    }
    return result;
  }

  private static transform<K extends keyof Training>(property: K, value: string, config: TrainingsschemaConfiguration): Training[K] {
    switch (property) {
      case 'datum':
        return DateTime.fromFormat(value, config.params.dateFormat).toISODate();
      default:
        return value;
    }
  }
}
