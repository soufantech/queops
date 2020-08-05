import { ValueParser, ValueParseResult } from '../querystr-model';

export type ScalarParser<TValue = unknown> = ValueParser<TValue>;

function internalStringParser(value: string): ValueParseResult<string> {
  return { value };
}

export function stringParser(this: void): ScalarParser<string> {
  return internalStringParser;
}

function internalNumberParser(value: string): ValueParseResult<number> {
  const parsed = parseInt(value, 10);

  return { value: isNaN(parsed) ? undefined : parsed };
}

export function numberParser(this: void): ScalarParser<number> {
  return internalNumberParser;
}

const booleanDict = {
  true: true,
  false: false,
} as Record<string, boolean>;

function internalBooleanParser(value: string): ValueParseResult<boolean> {
  return { value: booleanDict[value] };
}

export function booleanParser(this: void): ScalarParser<boolean> {
  return internalBooleanParser;
}

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
