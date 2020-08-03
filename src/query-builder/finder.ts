export interface Finder<TData> {
  findOne(dataset: TData[]): TData | undefined;
  findAll(dataset: TData[]): TData[];
}
