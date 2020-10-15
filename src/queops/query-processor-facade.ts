import {
  ElementDateProcessor,
  ElementDateProcessorOptions,
  ElementFloatProcessor,
  ElementFloatProcessorOptions,
  ElementIntProcessor,
  ElementIntProcessorOptions,
  ElementStringProcessor,
  ElementStringProcessorOptions,
  EqualBoolProcessor,
  EqualBoolProcessorOptions,
  EqualDateProcessor,
  EqualDateProcessorOptions,
  EqualFloatProcessor,
  EqualFloatProcessorOptions,
  EqualIntProcessor,
  EqualIntProcessorOptions,
  EqualStringProcessor,
  EqualStringProcessorOptions,
  LogicalDateProcessor,
  LogicalDateProcessorOptions,
  LogicalFloatProcessor,
  LogicalFloatProcessorOptions,
  LogicalIntProcessor,
  LogicalIntProcessorOptions,
  LogicalStringProcessor,
  LogicalStringProcessorOptions,
  QueryLimitProcessor,
  QueryLimitProcessorOptions,
  QueryOffsetProcessor,
  QueryOffsetProcessorOptions,
  RangeDateProcessor,
  RangeDateProcessorOptions,
  RangeFloatProcessor,
  RangeFloatProcessorOptions,
  RangeIntProcessor,
  RangeIntProcessorOptions,
  QueryOrderProcessor,
  QueryOrderProcessorOptions,
  QueryProjectProcessorOptions,
  QueryProjectProcessor,
  QuerySearchProcessorOptions,
  QuerySearchProcessor,
} from './processors';

export function equalString(
  this: void,
  options?: EqualStringProcessorOptions,
): EqualStringProcessor {
  return new EqualStringProcessor(options);
}

export function equalInt(
  this: void,
  options?: EqualIntProcessorOptions,
): EqualIntProcessor {
  return new EqualIntProcessor(options);
}

export function equalFloat(
  this: void,
  options?: EqualFloatProcessorOptions,
): EqualFloatProcessor {
  return new EqualFloatProcessor(options);
}

export function equalDate(
  this: void,
  options?: EqualDateProcessorOptions,
): EqualDateProcessor {
  return new EqualDateProcessor(options);
}

export function equalBool(
  this: void,
  options?: EqualBoolProcessorOptions,
): EqualBoolProcessor {
  return new EqualBoolProcessor(options);
}

export function elementInt(
  this: void,
  options?: ElementIntProcessorOptions,
): ElementIntProcessor {
  return new ElementIntProcessor(options);
}

export function elementFloat(
  this: void,
  options?: ElementFloatProcessorOptions,
): ElementFloatProcessor {
  return new ElementFloatProcessor(options);
}

export function elementString(
  this: void,
  options?: ElementStringProcessorOptions,
): ElementStringProcessor {
  return new ElementStringProcessor(options);
}

export function elementDate(
  this: void,
  options?: ElementDateProcessorOptions,
): ElementDateProcessor {
  return new ElementDateProcessor(options);
}

export function logicalDate(
  this: void,
  options?: LogicalDateProcessorOptions,
): LogicalDateProcessor {
  return new LogicalDateProcessor(options);
}

export function logicalFloat(
  this: void,
  options?: LogicalFloatProcessorOptions,
): LogicalFloatProcessor {
  return new LogicalFloatProcessor(options);
}

export function logicalInt(
  this: void,
  options?: LogicalIntProcessorOptions,
): LogicalIntProcessor {
  return new LogicalIntProcessor(options);
}

export function logicalString(
  this: void,
  options?: LogicalStringProcessorOptions,
): LogicalStringProcessor {
  return new LogicalStringProcessor(options);
}

export function rangeDate(
  this: void,
  options?: RangeDateProcessorOptions,
): RangeDateProcessor {
  return new RangeDateProcessor(options);
}

export function rangeInt(
  this: void,
  options?: RangeIntProcessorOptions,
): RangeIntProcessor {
  return new RangeIntProcessor(options);
}

export function rangeFloat(
  this: void,
  options?: RangeFloatProcessorOptions,
): RangeFloatProcessor {
  return new RangeFloatProcessor(options);
}

export function queryLimit(
  this: void,
  options?: QueryLimitProcessorOptions,
): QueryLimitProcessor {
  return new QueryLimitProcessor(options);
}

export function queryOffset(
  this: void,
  options?: QueryOffsetProcessorOptions,
): QueryOffsetProcessor {
  return new QueryOffsetProcessor(options);
}

export function queryOrder(
  this: void,
  options?: QueryOrderProcessorOptions,
): QueryOrderProcessor {
  return new QueryOrderProcessor(options);
}

export function queryProject(
  this: void,
  options?: QueryProjectProcessorOptions,
): QueryProjectProcessor {
  return new QueryProjectProcessor(options);
}

export function querySearch(
  this: void,
  options?: QuerySearchProcessorOptions,
): QuerySearchProcessor {
  return new QuerySearchProcessor(options);
}
