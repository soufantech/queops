import { Dispatcher } from './dispatcher';

export class QueryBuilder<TData, TContext = unknown> {
  private readonly dispatchers: Dispatcher<TData, TContext>[] = [];

  public register(dispatcher: Dispatcher<TData, TContext>): this {
    this.dispatchers.push(dispatcher);

    return this;
  }

  public build(dataset: TData[], context: TContext): this {
    this.dispatchers.forEach((dispatcher) => {
      dispatcher.handle(dataset, context);
    });

    return this;
  }
}
