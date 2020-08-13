import { ValueParser, ParsedKeyValue } from '../../querystr-model';
import { Dispatcher } from '../../query-builder';
import { FindOptions } from 'sequelize';

export interface FieldType<T = unknown> {
  getParser(): ValueParser<T | T[]>;
  getDispatcher(
    key: string,
    alias?: string,
  ): Dispatcher<ParsedKeyValue, FindOptions>;
}
