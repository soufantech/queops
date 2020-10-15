import { dateParser } from './value-parsers';

import { RangeProcessorBase, RangeProcessorBaseOptions } from './base-range';

export type RangeDateProcessorOptions = RangeProcessorBaseOptions<Date>;

const NAME = 'RANGE_DATE';

export class RangeDateProcessor extends RangeProcessorBase<Date> {
  constructor(options: RangeDateProcessorOptions = {}) {
    super(
      {
        parser: dateParser(),
        name: NAME,
      },
      options,
    );
  }
}
