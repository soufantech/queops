import { EqualProcessorBase, EqualProcessorBaseOptions } from './base-equal';
import { floatParser } from './value-parsers';

export type EqualFloatProcessorOptions = EqualProcessorBaseOptions<number>;

const NAME = 'EQUAL_FLOAT';

export class EqualFloatProcessor extends EqualProcessorBase<number> {
  constructor(options: EqualFloatProcessorOptions = {}) {
    super(
      {
        parser: floatParser(),
        name: NAME,
      },
      options,
    );
  }
}
