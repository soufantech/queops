import { EqualProcessorBase, EqualProcessorBaseOptions } from './base-equal';
import { integerParser } from './value-parsers';

export type EqualIntProcessorOptions = EqualProcessorBaseOptions<number>;

const NAME = 'EQUAL_INT';

export class EqualIntProcessor extends EqualProcessorBase<number> {
  constructor(options: EqualIntProcessorOptions = {}) {
    super(
      {
        parser: integerParser(),
        name: NAME,
      },
      options,
    );
  }
}
