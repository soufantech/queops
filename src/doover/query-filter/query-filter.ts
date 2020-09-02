import { QueryFilterInput } from './query-filter-input';
import { QueryBuilderDispatcher } from './query-builder-dispatcher';

export interface QueryFilter<TOperand = unknown> {
  filter(
    filterInput: QueryFilterInput<TOperand>,
  ): QueryBuilderDispatcher | undefined;
}

// export type BaseQueryFilterParams<TOperand = unknown> = {
//   middlewares?: QueryFilterMiddleware<TOperand>[];
// };

// // export type BaseQueryFilterParams = {
// //   name: string;
// // };

// const nullOpcodeMatcher: OpcodeMatcher = (opcode) => opcode === null;

// export abstract class BaseQueryFilter<TOperand = unknown> extends MiddlewaredQueryFilter
//   constructor({ validator, allowOnly }: BaseQueryFilterParams<TOperand>) {

//   }

//   abstract getDispatcher(
//     filterInput: QueryFilterInput<TOperand>,
//   ): QueryBuilderDispatcher | undefined;

//   private runMiddlewares(
//     filterInput: QueryFilterInput<TOperand>,
//   ): QueryFilterInput<TOperand> | undefined {
//     return this.middlewares.reduce((input, middleware) => {
//       if (input === undefined) {
//         return input;
//       }

//       return middleware(input);
//     }, filterInput);
//   }

//   public filter(
//     filterInput: QueryFilterInput<TOperand>,
//   ): QueryBuilderDispatcher | undefined {
//     const input = this.runMiddlewares(filterInput);

//     if (input === undefined) {
//       return undefined;
//     }

//     return this.getDispatcher(input);
//   }
// }

// export abstract class BaseQueryFilter<TValue = unknown> implements QueryFilter {
//   private readonly validator: Validator;
//   private readonly opcodeMatcher: OpcodeMatcher;
//   public readonly name: string;

//   constructor(
//     params: BaseQueryFilterParams,
//     options: BaseQueryFilterOptions = {},
//   ) {
//     const { opcodeMatcher, validator } = options;
//     const { name } = params;

//     this.name = name;
//     this.validator = validator ?? validatorStub;
//     this.opcodeMatcher = this.normalizeOpcodeMatcher(opcodeMatcher);
//   }

//   private normalizeOpcodeMatcher(
//     opcodeMatcher: OpcodeMatcher | string[],
//   ): OpcodeMatcher {
//     if (Array.isArray(opcodeMatcher)) {
//       const allowedOpcodes = new Set<string>(opcodeMatcher);

//       return (opcode) => allowedOpcodes.has(opcode as string);
//     }

//     if (typeof opcodeMatcher === 'function') {
//       return opcodeMatcher;
//     }

//     return nullOpcodeMatcher;
//   }

//   public filter(querybuilder: QueryBuilderInterface) {
//     const normalizedOpcode = opcode ?? null;

//     if (!this.opcodeMatcher(normalizedOpcode)) {
//       return;
//     }

//     const { value: validValue, error } = this.validator.validate<TValue>(value);

//     if (error) {
//       return;
//     }
//   }
// }
