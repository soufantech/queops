import { ValueParser } from '../../value-parser';

export { ScalarParser } from '../scalar';

export type CompositeParser<TValue extends unknown[] = unknown[]> = ValueParser<
  TValue
>;
