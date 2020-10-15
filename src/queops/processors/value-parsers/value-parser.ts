export interface ValueParseResult<TValue = unknown> {
  opcode?: string | null;
  value?: TValue;
}

export interface ValueParser<TValueReturn = unknown> {
  (value: string): ValueParseResult<TValueReturn>;
}
