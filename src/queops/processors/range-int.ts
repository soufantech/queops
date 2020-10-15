import { integerParser } from './value-parsers';

import { RangeProcessorBase, RangeProcessorBaseOptions } from './base-range';

export type RangeIntProcessorOptions = RangeProcessorBaseOptions<number>;

const NAME = 'RANGE_INT';

export class RangeIntProcessor extends RangeProcessorBase<number> {
  constructor(options: RangeIntProcessorOptions = {}) {
    super(
      {
        parser: integerParser(),
        name: NAME,
      },
      options,
    );
  }
}
