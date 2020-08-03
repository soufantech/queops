export interface ValueParser {
  (value: string): unknown;
}

export function identityParser(value: string): string {
  return value;
}
