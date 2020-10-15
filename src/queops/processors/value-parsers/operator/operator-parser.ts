import { OperatorValueParser } from './operator-value-parser';
import { baseOperatorParser, OpcodeMatcher } from './base-operator-parser';
import { ValueParser } from '../value-parser';

function createOpcodeMatcher(
  opcodes: string | readonly string[],
): OpcodeMatcher {
  const opcodesToMatch = ([] as string[]).concat(opcodes);

  return (opcode: string): boolean => {
    return opcodesToMatch.includes(opcode);
  };
}

export function operatorParser<T>(
  this: void,
  opcodes: string | readonly string[],
  valueParser: ValueParser<T>,
): OperatorValueParser<T> {
  const matcher = createOpcodeMatcher(opcodes);

  return baseOperatorParser(matcher, valueParser);
}
