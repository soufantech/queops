export interface MultiMatchCallback<TData, TContext = unknown> {
  (this: void, matches: TData[], context: TContext): void;
}

export interface SingleMatchCallback<TData, TContext = unknown> {
  (this: void, match: TData, context: TContext): void;
}
