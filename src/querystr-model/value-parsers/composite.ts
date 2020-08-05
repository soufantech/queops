import { ValueParser } from '../querystr-model';
import { ScalarParser } from './scalar';

export type CompositeParser<TValue extends unknown[] = unknown[]> = ValueParser<
  TValue
>;

export function unescapedListParser<T>(
  this: void,
  scalarParser: ScalarParser<T>,
  { separator = ',' } = {},
): CompositeParser<T[]> {
  return (value: string) => {
    const values = value
      .split(separator)
      .map((el) => scalarParser(el).value)
      .filter((el) => el !== undefined) as T[];

    return { value: values.length ? values : undefined };
  };
}

export function unescapedRangeParser<T>(
  this: void,
  scalarParser: ScalarParser<T>,
  { separator = '..' } = {},
): CompositeParser<T[]> {
  return (value: string) => {
    const values = value
      .split(separator, 2)
      .map((el) => scalarParser(el).value)
      .filter((el) => el !== undefined) as T[];

    return { value: values.length ? values : undefined };
  };
}
