import { ScalarParser } from './scalar-parser';
import { ValueParseResult } from '../value-parser';

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
