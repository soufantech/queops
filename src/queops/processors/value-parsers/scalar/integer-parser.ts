import { ScalarParser } from './scalar-parser';
import { ValueParseResult } from '../value-parser';

function internalIntegerParser(value: string): ValueParseResult<number> {
  const parsed = parseInt(value, 10);

  return { value: Number.isSafeInteger(parsed) ? parsed : undefined };
}

export type IntegerParserOptions = {
  max?: number;
  min?: number;
};

export function integerParser(
  this: void,
  options: IntegerParserOptions = {},
): ScalarParser<number> {
  if (options === undefined || !Object.keys(options).length) {
    return internalIntegerParser;
  }

  const { max = +Infinity, min = -Infinity } = options;

  return (value: string) => {
    const { value: parsed } = internalIntegerParser(value);

    if (parsed === undefined || parsed > max || parsed < min) {
      return { value: undefined };
    }

    return { value: parsed };
  };
}
