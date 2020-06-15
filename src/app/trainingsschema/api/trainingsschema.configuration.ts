import {Training} from '../model/training';

export interface TrainingsschemaConfiguration {

  columns: { [columnName: string]: keyof Training };
  params: {
    dateFormat: string
    groepRemoveSubstrings: string[]
  };

}
