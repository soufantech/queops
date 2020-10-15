import { EqualProcessorBase, EqualProcessorBaseOptions } from './base-equal';
import { booleanParser } from './value-parsers';

export type EqualBoolProcessorOptions = EqualProcessorBaseOptions<boolean>;

const NAME = 'EQUAL_BOOL';

export class EqualBoolProcessor extends EqualProcessorBase<boolean> {
  constructor(options: EqualBoolProcessorOptions = {}) {
    super(
      {
        parser: booleanParser(),
        name: NAME,
      },
      options,
    );
  }
}
