import { ValueParser, ValueParseResult } from '../querystr-model';

export type OperatorParser<TValue = unknown> = ValueParser<TValue>;

type SplitOpcode = string;
type SplitValue = string;

function splitOperatorValueStr(value: string): [SplitValue, SplitOpcode] {
  const index = value.indexOf(':');

  return [value.substring(index + 1), value.substring(0, index)];
}

function internalOperatorParser(value: string): ValueParseResult<string> {
  const [parsedValue, parsedOpcode] = splitOperatorValueStr(value);

  return {
    value: parsedValue === '' ? undefined : parsedValue,
    opcode: parsedOpcode != null ? parsedOpcode : null,
  };
}

export function rawOperatorParser(this: void): ValueParser<string> {
  return internalOperatorParser;
}

export interface OpcodeMatcher {
  (opcode: string): boolean;
}

export function baseOperatorParser<T>(
  this: void,
  matcher: OpcodeMatcher,
  valueParser: ValueParser<T>,
): OperatorParser<T> {
  return (value: string): ValueParseResult<T> => {
    const { value: opvalue, opcode } = internalOperatorParser(value);

    if (opvalue === undefined || !matcher(opcode as string)) {
      console.log({ opcode, opvalue, match: !matcher(opcode as string) });
      return { value: undefined };
    }

    return {
      value: valueParser(opvalue).value,
      opcode,
    };
  };
}

function createOpcodeMatcher(opcodes: string | string[]): OpcodeMatcher {
  const opcodesToMatch = ([] as string[]).concat(opcodes);

  return (opcode: string): boolean => {
    return opcodesToMatch.includes(opcode);
  };
}

export function operatorParser<T>(
  this: void,
  opcodes: string | string[],
  valueParser: ValueParser<T>,
): OperatorParser<T> {
  const matcher = createOpcodeMatcher(opcodes);

  return baseOperatorParser(matcher, valueParser);
}
