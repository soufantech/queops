import {
  RangeDateUriParamHandler,
  RangeDateUriParamHandlerOptions,
  ElementStringUriParamHandler,
  ElementStringUriParamHandlerOptions,
} from './uri-param-handler';

export const UriParam = {
  rangeDate(
    field: string,
    options?: RangeDateUriParamHandlerOptions,
  ): RangeDateUriParamHandler {
    return new RangeDateUriParamHandler(field, options);
  },

  elementString(
    field: string,
    options?: ElementStringUriParamHandlerOptions,
  ): ElementStringUriParamHandler {
    return new ElementStringUriParamHandler(field, options);
  },
};
