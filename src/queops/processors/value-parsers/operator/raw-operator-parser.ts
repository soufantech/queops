import { ValueParser, ValueParseResult } from '../value-parser';

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
