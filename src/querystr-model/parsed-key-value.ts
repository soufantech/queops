export interface ParsedKeyValue {
  opcode: string | null;
  key: string;
  originalValue: string;
  value: unknown;
}
