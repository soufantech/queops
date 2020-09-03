import { dateParser } from '../value-parser';

import {
  RangeUriParamHandlerParams,
  RangeUriParamHandler,
} from './range-uri-param-handler';

export type RangeDateUriParamHandlerParams = Omit<
  RangeUriParamHandlerParams<Date>,
  'operandParser'
>;

export class RangeDateUriParamHandler extends RangeUriParamHandler<Date> {
  constructor(params: RangeDateUriParamHandlerParams) {
    super({
      ...params,
      operandParser: dateParser(),
    });
  }
}
