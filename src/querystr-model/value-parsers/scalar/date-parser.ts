import { ScalarParser, ValueParseResult } from './scalar-parser';

function internalDateParser(value: string): ValueParseResult<Date> {
  try {
    return { value: new Date(value) };
  } catch (_err) {
    return { value: undefined };
  }
}

export function dateParser(this: void): ScalarParser<Date> {
  return internalDateParser;
}
