import { ScalarParser, ValueParseResult } from './scalar-parser';

function internalFloatParser(value: string): ValueParseResult<number> {
  const parsed = parseFloat(value);

  return { value: Number.isFinite(parsed) ? parsed : undefined };
}

export type FloatParserOptions = {
  max?: number;
  min?: number;
};

export function floatParser(
  options?: FloatParserOptions,
): ScalarParser<number> {
  if (options === undefined || !Object.keys(options).length) {
    return internalFloatParser;
  }

  const { max = +Infinity, min = -Infinity } = options;

  return (value: string) => {
    const { value: parsed } = internalFloatParser(value);

    if (parsed === undefined || parsed > max || parsed < min) {
      return { value: undefined };
    }

    return { value: parsed };
  };
}
