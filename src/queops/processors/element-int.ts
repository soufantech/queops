import { integerParser } from './value-parsers';

import {
  ElementProcessorBase,
  ElementProcessorBaseOptions,
} from './base-element';

export type ElementIntProcessorOptions = ElementProcessorBaseOptions<number>;

const NAME = 'ELEMENT_INT';

export class ElementIntProcessor extends ElementProcessorBase<number> {
  constructor(options: ElementIntProcessorOptions = {}) {
    super(
      {
        parser: integerParser(),
        name: NAME,
      },
      options,
    );
  }
}
