import { ParsedKeyValue } from './parsed-key-value';
import { Finder } from '../query-builder';

type SearchArray = Array<keyof SearchCriteria>[];

export interface SearchCriteria {
  key?: string;
  opcode?: string | null;
}

export class ParsedKeyValueFinder implements Finder<ParsedKeyValue> {
  private readonly searches: SearchArray;

  constructor(searches: SearchCriteria) {
    this.searches = Object.entries(searches);
  }

  findOne(parsed: ParsedKeyValue[]): ParsedKeyValue | undefined {
    return parsed.find((p) => {
      return this.searches.every(
        ([k, v]) => p[k as keyof ParsedKeyValue] === v,
      );
    });
  }

  findAll(parsed: ParsedKeyValue[]): ParsedKeyValue[] {
    return parsed.filter((p) => {
      return this.searches.every(
        ([k, v]) => p[k as keyof ParsedKeyValue] === v,
      );
    });
  }
}
