import { ScalarParser } from './scalar-parser';

export type EnumParserOptions = {
  transform?: (value: string) => string;
};

export function enumParser(
  this: void,
  values: string[],
  options: EnumParserOptions = {},
): ScalarParser<string> {
  const { transform = (e) => e } = options;

  return (value: string) => {
    if (values.includes(value)) {
      return { value: transform(value) };
    }

    return { value: undefined };
  };
}
