import { ScalarParser, CompositeParser } from './composite-parser';

const RANGE_TUPLE_SIZE = 2;

export function unescapedRangeParser<T>(
  this: void,
  scalarParser: ScalarParser<T>,
  { separator = '..' } = {},
): CompositeParser<T[]> {
  return (value: string) => {
    const values = value
      .split(separator, RANGE_TUPLE_SIZE + 1)
      .slice(0, RANGE_TUPLE_SIZE)
      .map((el) => scalarParser(el).value) as T[];

    const scalarParseFailed = values.some((el) => el === undefined);

    if (scalarParseFailed) {
      return { value: undefined };
    }

    return {
      value: values.length === RANGE_TUPLE_SIZE ? values : undefined,
    };
  };
}
