import { ScalarParser, CompositeParser } from './composite-parser';

export type UnescapedListParserOptions = {
  separator?: string;
  maxElements?: number;
};

export function unescapedListParser<T>(
  this: void,
  scalarParser: ScalarParser<T>,
  { separator = ',', maxElements }: UnescapedListParserOptions = {},
): CompositeParser<T[]> {
  return (value: string) => {
    const values = value
      .split(separator, maxElements ? maxElements + 1 : undefined)
      .slice(0, maxElements)
      .map((el) => scalarParser(el).value) as T[];

    const scalarParseFailed = values.some((el) => el === undefined);

    if (scalarParseFailed) {
      return { value: undefined };
    }

    return { value: values.length ? values : undefined };
  };
}
