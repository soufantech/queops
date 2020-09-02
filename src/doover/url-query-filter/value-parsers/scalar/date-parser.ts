import { ScalarParser, ValueParseResult } from './scalar-parser';

function internalDateParser(value: string): ValueParseResult<Date> {
  const date = new Date(value);

  return { value: isNaN(date.getTime()) ? undefined : date };
}

export function dateParser(this: void): ScalarParser<Date> {
  return internalDateParser;
}
