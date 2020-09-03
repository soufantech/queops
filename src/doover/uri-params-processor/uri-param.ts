import {
  RangeDateUriParamHandler,
  RangeDateUriParamHandlerOptions,
  ElementStringUriParamHandler,
  ElementStringUriParamHandlerOptions,
  LogicalIntUriParamHandler,
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

  logicalInt(field: string): LogicalIntUriParamHandler {
    return new LogicalIntUriParamHandler(field);
  },
};
