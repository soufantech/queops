import { dateParser } from '../value-parsers';

import {
  RangeUrlQueryFilterHandlerParams,
  RangeUrlQueryFilterHandler,
} from './range-url-query-filter-handler';

export type RangeDateUrlQueryFilterHandlerParams = Omit<
  RangeUrlQueryFilterHandlerParams<Date>,
  'operandParser'
>;

export class RangeDateUrlQueryFilterHandler extends RangeUrlQueryFilterHandler<
  Date
> {
  constructor(params: RangeDateUrlQueryFilterHandlerParams) {
    super({
      ...params,
      operandParser: dateParser(),
    });
  }
}
