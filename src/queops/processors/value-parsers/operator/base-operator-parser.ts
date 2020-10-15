import { OperatorValueParser } from './operator-value-parser';
import { rawOperatorParser } from './raw-operator-parser';
import { ValueParser, ValueParseResult } from '../value-parser';

export interface OpcodeMatcher {
  (opcode: string): boolean;
}

const parseRawOperator = rawOperatorParser();

export function baseOperatorParser<T>(
  this: void,
  matcher: OpcodeMatcher,
  valueParser: ValueParser<T>,
): OperatorValueParser<T> {
  return (value: string): ValueParseResult<T> => {
    const { value: opvalue, opcode } = parseRawOperator(value);

    if (opvalue === undefined || !matcher(opcode as string)) {
      return { value: undefined };
    }

    return {
      value: valueParser(opvalue).value,
      opcode,
    };
  };
}
