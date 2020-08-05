export interface Finder<TData> {
  findOne(dataset: TData[]): TData | undefined;
  findAll(dataset: TData[]): TData[];
}

type PropUnion<T> = T[keyof T];
type OrArray<T> = T | T[];

export type ObjectFinderSubject = Record<string, unknown>;

export type ObjectFinderCriteria<
  TSubject extends ObjectFinderSubject
> = Partial<Record<keyof TSubject, OrArray<PropUnion<TSubject>>>>;

type CriteriaKey<TCriteria> = keyof TCriteria;

type CriteriaValue<TCriteria> = PropUnion<TCriteria>;

type CriteriaEntries<TCriteria> = [
  CriteriaKey<TCriteria>,
  CriteriaValue<TCriteria>[],
][];

export class ObjectFinder<
  TSubject extends ObjectFinderSubject,
  TCriteria extends ObjectFinderCriteria<TSubject> = ObjectFinderCriteria<
    TSubject
  >
> implements Finder<TSubject> {
  private readonly criteria: CriteriaEntries<TCriteria>;

  constructor(criteria: TCriteria) {
    this.criteria = Object.entries(criteria).map(([k, v]) => {
      return [
        k as CriteriaKey<TCriteria>,
        ([] as CriteriaValue<TCriteria>[]).concat(
          v as CriteriaValue<TCriteria>,
        ),
      ];
    }) as CriteriaEntries<TCriteria>;
  }

  findOne(subjects: TSubject[]): TSubject | undefined {
    return subjects.find((p) => {
      return this.criteria.every(([k, v]) =>
        v.includes(p[k as keyof TSubject] as CriteriaValue<TCriteria>),
      );
    });
  }

  findAll(subjects: TSubject[]): TSubject[] {
    return subjects.filter((p) => {
      return this.criteria.every(([k, v]) =>
        v.includes(p[k as keyof TSubject] as CriteriaValue<TCriteria>),
      );
    });
  }
}
