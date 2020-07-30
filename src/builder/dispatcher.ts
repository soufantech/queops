import { ParsedKeyValue } from '../core';

export interface MultiMatchCallback<T = unknown> {
  (matches: ParsedKeyValue[], context: T): void;
}

export interface SingleMatchCallback<T = unknown> {
  (match: ParsedKeyValue, context: T): void;
}

export interface SearchCriteria {
  key?: string;
  opcode?: string | null;
}

type SearchArray = Array<keyof SearchCriteria>[];

function findOne(
  searches: SearchArray,
  parsed: ParsedKeyValue[],
): ParsedKeyValue | undefined {
  return parsed.find((p) => {
    return searches.every(([k, v]) => p[k as keyof ParsedKeyValue] === v);
  });
}

function findAll(
  searches: SearchArray,
  parsed: ParsedKeyValue[],
): ParsedKeyValue[] {
  return parsed.filter((p) => {
    return searches.every(([k, v]) => p[k as keyof ParsedKeyValue] === v);
  });
}

export interface Dispatcher<T = unknown> {
  handle(parsed: ParsedKeyValue[], context: T): void;
}

export class EachDispatcher<T = unknown> implements Dispatcher<T> {
  private readonly callback: SingleMatchCallback<T>;
  private readonly searches: SearchArray;

  constructor(callback: SingleMatchCallback<T>, search: SearchCriteria) {
    this.callback = callback;
    this.searches = Object.entries(search);
  }

  public handle(parsed: ParsedKeyValue[], context: T): void {
    const matches = findAll(this.searches, parsed);

    matches.forEach((match) => this.callback(match, context));
  }
}

export class EveryDispatcher<T = unknown> implements Dispatcher<T> {
  private readonly callback: MultiMatchCallback<T>;
  private readonly searches: SearchArray;

  constructor(callback: MultiMatchCallback<T>, search: SearchCriteria) {
    this.callback = callback;
    this.searches = Object.entries(search);
  }

  public handle(parsed: ParsedKeyValue[], context: T): void {
    const matches = findAll(this.searches, parsed);

    if (matches.length) {
      this.callback(matches, context);
    }
  }
}

export class LastDispatcher<T = unknown> implements Dispatcher<T> {
  private readonly callback: SingleMatchCallback<T>;
  private readonly searches: SearchArray;

  constructor(callback: SingleMatchCallback<T>, search: SearchCriteria) {
    this.callback = callback;
    this.searches = Object.entries(search);
  }

  public handle(parsed: ParsedKeyValue[], context: T): void {
    const matches = findAll(this.searches, parsed);
    const match = matches[matches.length - 1];

    if (match) {
      this.callback(match, context);
    }
  }
}

export class FirstDispatcher<T = unknown> implements Dispatcher<T> {
  private readonly callback: SingleMatchCallback<T>;
  private readonly searches: SearchArray;

  constructor(callback: SingleMatchCallback<T>, search: SearchCriteria) {
    this.callback = callback;
    this.searches = Object.entries(search);
  }

  public handle(parsed: ParsedKeyValue[], context: T): void {
    const match = findOne(this.searches, parsed);

    if (match) {
      this.callback(match, context);
    }
  }
}

export class AllDispatcher<T = unknown> implements Dispatcher<T> {
  private readonly callback: MultiMatchCallback<T>;

  constructor(callback: MultiMatchCallback<T>) {
    this.callback = callback;
  }

  public handle(parsed: ParsedKeyValue[], context: T): void {
    if (parsed.length) {
      this.callback(parsed, context);
    }
  }
}
