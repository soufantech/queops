import { EqualProcessorBase, EqualProcessorBaseOptions } from './base-equal';
import { stringParser } from './value-parsers';

export type EqualStringProcessorOptions = EqualProcessorBaseOptions<string>;

const NAME = 'EQUAL_STRING';

export class EqualStringProcessor extends EqualProcessorBase<string> {
  constructor(options: EqualStringProcessorOptions = {}) {
    super(
      {
        parser: stringParser(),
        name: NAME,
      },
      options,
    );
  }
}
