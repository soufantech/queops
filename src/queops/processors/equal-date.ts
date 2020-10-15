import { EqualProcessorBase, EqualProcessorBaseOptions } from './base-equal';
import { dateParser } from './value-parsers';

export type EqualDateProcessorOptions = EqualProcessorBaseOptions<Date>;

const NAME = 'EQUAL_DATE';

export class EqualDateProcessor extends EqualProcessorBase<Date> {
  constructor(options: EqualDateProcessorOptions = {}) {
    super(
      {
        parser: dateParser(),
        name: NAME,
      },
      options,
    );
  }
}
