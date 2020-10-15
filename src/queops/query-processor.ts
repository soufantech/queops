import { QueryBuilder } from './query-builder';

export interface QueryAction {
  (subject: QueryBuilder): void;
}

export type Notice = {
  queryValues: string[];
  queryKey: string;
  queryType: string;
  message: string;
  code: string;
};

export type QueryProcessingResult = {
  action: QueryAction;
  notices: Notice[];
};

export interface QueryProcessor {
  process(field: string, values: string[]): QueryProcessingResult;
}
