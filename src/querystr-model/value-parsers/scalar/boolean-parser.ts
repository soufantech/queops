import { ScalarParser, ValueParseResult } from './scalar-parser';

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
