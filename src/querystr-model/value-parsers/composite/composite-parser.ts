import { ValueParser } from '../../querystr-model';

export { ScalarParser } from '../scalar';

export type CompositeParser<TValue extends unknown[] = unknown[]> = ValueParser<
  TValue
>;
