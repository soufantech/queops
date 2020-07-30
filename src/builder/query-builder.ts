import {
  SearchCriteria,
  Dispatcher,
  SingleMatchCallback,
  MultiMatchCallback,
  AllDispatcher,
  FirstDispatcher,
  LastDispatcher,
  EachDispatcher,
  EveryDispatcher,
} from './dispatcher';
import { ParsedKeyValue } from '../core';

export class QueryBuilder<T = unknown> {
  private readonly dispatchers: Dispatcher<T>[] = [];

  public onFirst(
    search: SearchCriteria,
    callback: SingleMatchCallback<T>,
  ): this {
    this.dispatchers.push(new FirstDispatcher(callback, search));

    return this;
  }

  public onLast(
    search: SearchCriteria,
    callback: SingleMatchCallback<T>,
  ): this {
    this.dispatchers.push(new LastDispatcher(callback, search));

    return this;
  }

  public onEvery(
    search: SearchCriteria,
    callback: MultiMatchCallback<T>,
  ): this {
    this.dispatchers.push(new EveryDispatcher(callback, search));

    return this;
  }

  public onEach(
    search: SearchCriteria,
    callback: SingleMatchCallback<T>,
  ): this {
    this.dispatchers.push(new EachDispatcher(callback, search));

    return this;
  }

  public onAll(callback: MultiMatchCallback<T>): this {
    this.dispatchers.push(new AllDispatcher(callback));

    return this;
  }

  public build(parsed: ParsedKeyValue[], context: T): this {
    this.dispatchers.forEach((dispatcher) => {
      dispatcher.handle(parsed, context);
    });

    return this;
  }
}
