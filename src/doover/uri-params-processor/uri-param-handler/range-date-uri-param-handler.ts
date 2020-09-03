import { dateParser } from '../value-parser';
import {
  RangeUriParamHandlerOptions,
  RangeUriParamHandler,
} from './range-uri-param-handler';

export type RangeDateUriParamHandlerOptions = RangeUriParamHandlerOptions;

export class RangeDateUriParamHandler extends RangeUriParamHandler<Date> {
  constructor(field: string, options?: RangeDateUriParamHandlerOptions) {
    super(field, dateParser(), options);
  }
}
