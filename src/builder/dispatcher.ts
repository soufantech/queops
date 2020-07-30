import { ParsedKeyValue } from '../core';

export interface MultiMatchCallback {
  (matches: ParsedKeyValue[], context: unknown): void;
}

export interface SingleMatchCallback {
  (match: ParsedKeyValue, context: unknown): void;
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

export interface Dispatcher {
  handle(parsed: ParsedKeyValue[], context: unknown): void;
}

export class EachDispatcher implements Dispatcher {
  private readonly callback: SingleMatchCallback;
  private readonly searches: SearchArray;

  constructor(callback: SingleMatchCallback, search: SearchCriteria) {
    this.callback = callback;
    this.searches = Object.entries(search);
  }

  public handle(parsed: ParsedKeyValue[], context: unknown): void {
    const matches = findAll(this.searches, parsed);

    matches.forEach((match) => this.callback(match, context));
  }
}

export class EveryDispatcher implements Dispatcher {
  private readonly callback: MultiMatchCallback;
  private readonly searches: SearchArray;

  constructor(callback: MultiMatchCallback, search: SearchCriteria) {
    this.callback = callback;
    this.searches = Object.entries(search);
  }

  public handle(parsed: ParsedKeyValue[], context: unknown): void {
    const matches = findAll(this.searches, parsed);

    if (matches.length) {
      this.callback(matches, context);
    }
  }
}

export class LastDispatcher implements Dispatcher {
  private readonly callback: SingleMatchCallback;
  private readonly searches: SearchArray;

  constructor(callback: SingleMatchCallback, search: SearchCriteria) {
    this.callback = callback;
    this.searches = Object.entries(search);
  }

  public handle(parsed: ParsedKeyValue[], context: unknown): void {
    const matches = findAll(this.searches, parsed);
    const match = matches[matches.length - 1];

    if (match) {
      this.callback(match, context);
    }
  }
}

export class FirstDispatcher implements Dispatcher {
  private readonly callback: SingleMatchCallback;
  private readonly searches: SearchArray;

  constructor(callback: SingleMatchCallback, search: SearchCriteria) {
    this.callback = callback;
    this.searches = Object.entries(search);
  }

  public handle(parsed: ParsedKeyValue[], context: unknown): void {
    const match = findOne(this.searches, parsed);

    if (match) {
      this.callback(match, context);
    }
  }
}

export class AllDispatcher implements Dispatcher {
  private readonly callback: MultiMatchCallback;

  constructor(callback: MultiMatchCallback) {
    this.callback = callback;
  }

  public handle(parsed: ParsedKeyValue[], context: unknown): void {
    if (parsed.length) {
      this.callback(parsed, context);
    }
  }
}
