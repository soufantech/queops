import { ParsedKeyValue } from './parsed-key-value';
import { Finder } from '../query-builder';
import { PropUnion } from '../utility-types';

export interface ParsedKeyValueCriteria {
  key?: string | string[];
  opcode?: string | (string | null)[] | null;
}

type MatchDisjunction = keyof ParsedKeyValueCriteria;

type MatchConjunction = PropUnion<Pick<ParsedKeyValue, 'opcode' | 'key'>>;

type CriteriaArray = [MatchDisjunction, MatchConjunction[]][];

export class ParsedKeyValueFinder implements Finder<ParsedKeyValue> {
  private readonly criteria: CriteriaArray;

  constructor(searches: ParsedKeyValueCriteria) {
    this.criteria = Object.entries(searches).map(([k, v]) => {
      return [k as keyof ParsedKeyValueCriteria, [].concat(v)];
    }) as CriteriaArray;
  }

  findOne(parsed: ParsedKeyValue[]): ParsedKeyValue | undefined {
    return parsed.find((p) => {
      return this.criteria.every(([k, v]) =>
        v.includes(p[k as keyof ParsedKeyValue] as MatchConjunction),
      );
    });
  }

  findAll(parsed: ParsedKeyValue[]): ParsedKeyValue[] {
    return parsed.filter((p) => {
      return this.criteria.every(([k, v]) =>
        v.includes(p[k as keyof ParsedKeyValue] as MatchConjunction),
      );
    });
  }
}
