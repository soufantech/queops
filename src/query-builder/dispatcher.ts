import { Finder } from './finder';
import { MultiMatchCallback, SingleMatchCallback } from './callback';

export interface Dispatcher<TData, TContext = unknown> {
  handle(dataset: TData[], context: TContext): void;
}

export class EachDispatcher<TData, TContext = unknown>
  implements Dispatcher<TData, TContext> {
  private readonly callback: SingleMatchCallback<TData, TContext>;
  private readonly finder: Finder<TData>;

  constructor(
    finder: Finder<TData>,
    callback: SingleMatchCallback<TData, TContext>,
  ) {
    this.callback = callback;
    this.finder = finder;
  }

  public handle(dataset: TData[], context: TContext): void {
    const matches = this.finder.findAll(dataset);

    matches.forEach((match) => this.callback(match, context));
  }
}

export class EveryDispatcher<TData, TContext = unknown>
  implements Dispatcher<TData, TContext> {
  private readonly callback: MultiMatchCallback<TData, TContext>;
  private readonly finder: Finder<TData>;

  constructor(
    finder: Finder<TData>,
    callback: MultiMatchCallback<TData, TContext>,
  ) {
    this.callback = callback;
    this.finder = finder;
  }

  public handle(dataset: TData[], context: TContext): void {
    const matches = this.finder.findAll(dataset);

    if (matches.length) {
      this.callback(matches, context);
    }
  }
}

export class LastDispatcher<TData, TContext = unknown>
  implements Dispatcher<TData, TContext> {
  private readonly callback: SingleMatchCallback<TData, TContext>;
  private readonly finder: Finder<TData>;

  constructor(
    finder: Finder<TData>,
    callback: SingleMatchCallback<TData, TContext>,
  ) {
    this.callback = callback;
    this.finder = finder;
  }

  public handle(dataset: TData[], context: TContext): void {
    const matches = this.finder.findAll(dataset);
    const match = matches[matches.length - 1];

    if (match) {
      this.callback(match, context);
    }
  }
}

export class FirstDispatcher<TData, TContext = unknown>
  implements Dispatcher<TData, TContext> {
  private readonly callback: SingleMatchCallback<TData, TContext>;
  private readonly finder: Finder<TData>;

  constructor(
    finder: Finder<TData>,
    callback: SingleMatchCallback<TData, TContext>,
  ) {
    this.callback = callback;
    this.finder = finder;
  }

  public handle(dataset: TData[], context: TContext): void {
    const match = this.finder.findOne(dataset);

    if (match) {
      this.callback(match, context);
    }
  }
}

export class AllDispatcher<TData, TContext = unknown>
  implements Dispatcher<TData, TContext> {
  private readonly callback: MultiMatchCallback<TData, TContext>;

  constructor(callback: MultiMatchCallback<TData, TContext>) {
    this.callback = callback;
  }

  public handle(dataset: TData[], context: TContext): void {
    if (dataset.length) {
      this.callback(dataset, context);
    }
  }
}
