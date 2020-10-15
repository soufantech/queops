import { floatParser } from './value-parsers';

import {
  ElementProcessorBase,
  ElementProcessorBaseOptions,
} from './base-element';

export type ElementFloatProcessorOptions = ElementProcessorBaseOptions<number>;

const NAME = 'ELEMENT_FLOAT';

export class ElementFloatProcessor extends ElementProcessorBase<number> {
  constructor(options: ElementFloatProcessorOptions = {}) {
    super(
      {
        parser: floatParser(),
        name: NAME,
      },
      options,
    );
  }
}
