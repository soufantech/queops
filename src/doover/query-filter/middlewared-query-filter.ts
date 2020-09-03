import {
  QueryFilter,
  QueryFilterInput,
  QueryBuilderDispatcher,
} from './query-filter';
import { QueryFilterMiddleware } from './query-filter-middleware';

export abstract class MiddlewaredQueryFilter<TOperand = unknown>
  implements QueryFilter<TOperand> {
  private readonly middlewares: QueryFilterMiddleware<TOperand>[];

  constructor(middlewares?: QueryFilterMiddleware<TOperand>[]) {
    this.middlewares = middlewares ?? [];
  }

  public with(middleware: QueryFilterMiddleware<TOperand>): this {
    this.middlewares.push(middleware);

    return this;
  }

  abstract getDispatcher(
    filterInput: QueryFilterInput<TOperand>,
  ): QueryBuilderDispatcher | undefined;

  private runMiddlewares(
    filterInput: QueryFilterInput<TOperand>,
  ): QueryFilterInput<TOperand> | undefined {
    return this.middlewares.reduce<QueryFilterInput<TOperand> | undefined>(
      (input, middleware) => {
        if (input === undefined) {
          return input;
        }

        return middleware(input);
      },
      filterInput,
    );
  }

  public filter(
    filterInput: QueryFilterInput<TOperand>,
  ): QueryBuilderDispatcher | undefined {
    const input = this.runMiddlewares(filterInput);

    return input === undefined ? undefined : this.getDispatcher(input);
  }
}
