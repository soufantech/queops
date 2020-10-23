import util from 'util';

export function obj(a: unknown): void {
  console.log(util.inspect(a, false, 40, true));
}

export function json(a: unknown): void {
  console.log(JSON.stringify(a, null, 2));
}
