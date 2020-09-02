import { QueryFilterInput } from './query-filter-input';
import { QueryBuilderDispatcher } from './query-builder-dispatcher';
import { QueryFilter } from './query-filter';
import { QueryFilterMiddleware } from './query-filter-middleware';

export type MiddlewaredQueryFilterParams<TOperand = unknown> = {
  middlewares?: QueryFilterMiddleware<TOperand>[];
};

export abstract class MiddlewaredQueryFilter<TOperand = unknown>
  implements QueryFilter<TOperand> {
  private readonly middlewares: QueryFilterMiddleware<TOperand>[];

  constructor({ middlewares }: MiddlewaredQueryFilterParams<TOperand>) {
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

        const m = middleware(input);

        console.log(m);
        return m;
      },
      filterInput,
    );
  }

  public filter(
    filterInput: QueryFilterInput<TOperand>,
  ): QueryBuilderDispatcher | undefined {
    const input = this.runMiddlewares(filterInput);

    if (input === undefined) {
      return undefined;
    }

    return this.getDispatcher(input);
  }
}
