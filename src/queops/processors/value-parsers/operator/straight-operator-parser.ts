import { OperatorValueParser } from './operator-value-parser';
import { rawOperatorParser } from './raw-operator-parser';
import { ValueParseResult, ValueParser } from '../value-parser';
const parseRawOperator = rawOperatorParser();

export function straightOperatorParser<T>(
  this: void,
  valueParser: ValueParser<T>,
): OperatorValueParser<T> {
  return (value: string): ValueParseResult<T> => {
    const { value: opvalue, opcode } = parseRawOperator(value);

    if (opvalue === undefined) {
      return { value: undefined };
    }

    return {
      value: valueParser(opvalue).value,
      opcode,
    };
  };
}
