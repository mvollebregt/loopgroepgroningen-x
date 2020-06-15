import {Training} from '../model/training';

export interface TrainingsschemaConfiguration {
  [columnName: string]: keyof Training;
}
