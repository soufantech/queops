import { ScalarParser, ValueParseResult } from './scalar-parser';

function internalStringParser(value: string): ValueParseResult<string> {
  return { value };
}

export type StringParserOptions = {
  pattern?: RegExp;
};

export function stringParser(
  this: void,
  options?: StringParserOptions,
): ScalarParser<string> {
  if (options === undefined || !Object.keys(options).length) {
    return internalStringParser;
  }

  const { pattern = /(?:)/ } = options;

  return (value: string) => {
    if (pattern.test(value)) {
      return { value };
    }

    return { value: undefined };
  };
}
