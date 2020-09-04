import {
  RangeDateUriParamHandler,
  RangeDateUriParamHandlerOptions,
  ElementStringUriParamHandler,
  ElementStringUriParamHandlerOptions,
  LogicalIntUriParamHandler,
  LimitUriParamHandler,
  OffsetUriParamHandler,
  IncludeUriParamHandler,
  IncludeUriParamHandlerOptions,
  ExcludeUriParamHandler,
  ExcludeUriParamHandlerOptions,
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

  limit(): LimitUriParamHandler {
    return new LimitUriParamHandler();
  },

  offset(): OffsetUriParamHandler {
    return new OffsetUriParamHandler();
  },

  exclude(options?: ExcludeUriParamHandlerOptions): ExcludeUriParamHandler {
    return new ExcludeUriParamHandler(options);
  },

  include(options?: IncludeUriParamHandlerOptions): IncludeUriParamHandler {
    return new IncludeUriParamHandler(options);
  },
};
