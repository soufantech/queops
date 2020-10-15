import { floatParser } from './value-parsers';

import { RangeProcessorBase, RangeProcessorBaseOptions } from './base-range';

export type RangeFloatProcessorOptions = RangeProcessorBaseOptions<number>;

const NAME = 'RANGE_FLOAT';

export class RangeFloatProcessor extends RangeProcessorBase<number> {
  constructor(options: RangeFloatProcessorOptions = {}) {
    super(
      {
        parser: floatParser(),
        name: NAME,
      },
      options,
    );
  }
}
