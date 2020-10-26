/* eslint-disable @typescript-eslint/ban-types */
export function isObject(value: unknown): value is object {
  return value !== null && typeof value === 'object';
}

export const isArray = Array.isArray;

export function dedupe<T>(value: Iterable<T>): T[] {
  return Array.from(new Set(value));
}

export function objIsEmpty(obj: object): boolean {
  return Object.values(obj).every((v) => v === undefined);
}
