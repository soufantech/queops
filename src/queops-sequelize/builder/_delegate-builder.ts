import { Includeable } from 'sequelize';

export type SearchesHash = Record<string, string[]>;

export type Populator = () => Includeable;

export type PopulatorsHash = Record<string, Populator>;

export type DelegateBuilderConfig = {
  populators?: PopulatorsHash;
  searches?: SearchesHash;
};

export class DelegateBuilder {
  private readonly populators: PopulatorsHash;
  private readonly searches: SearchesHash;

  constructor(params: DelegateBuilderConfig = {}) {
    this.populators = params.populators ?? {};
    this.searches = params.searches ?? {};
  }

  populate(field: string): Includeable | undefined {
    const populator = this.populators[field];

    if (populator === undefined) {
      return undefined;
    }

    return populator();
  }

  expandSearch(field: string): string[] | undefined {
    return this.searches[field];
  }
}
