import { ValueParser } from '../../querystr-model';

export { ValueParseResult, ValueParser } from '../../querystr-model';

export type OperatorValueParser<TValue = unknown> = ValueParser<TValue>;
