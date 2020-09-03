import {
  RangeDateUriParamHandler,
  RangeUriParamHandlerOptions,
} from './uri-param-handler';

export const UriParam = {
  rangeDate(
    field: string,
    options?: RangeUriParamHandlerOptions,
  ): RangeDateUriParamHandler {
    return new RangeDateUriParamHandler(field, options);
  },
};
