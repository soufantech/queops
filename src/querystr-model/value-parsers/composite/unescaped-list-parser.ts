import { ScalarParser, CompositeParser } from './composite-parser';

export function unescapedListParser<T>(
  this: void,
  scalarParser: ScalarParser<T>,
  { separator = ',', maxElements = Infinity } = {},
): CompositeParser<T[]> {
  return (value: string) => {
    const values = value
      .split(separator, maxElements)
      .map((el) => scalarParser(el).value)
      .filter((el) => el !== undefined) as T[];

    return { value: values.length ? values : undefined };
  };
}
