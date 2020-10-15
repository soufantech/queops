import { stringParser } from './value-parsers';

import {
  ElementProcessorBase,
  ElementProcessorBaseOptions,
} from './base-element';

export type ElementStringProcessorOptions = ElementProcessorBaseOptions<string>;

const NAME = 'ELEMENT_STRING';

export class ElementStringProcessor extends ElementProcessorBase<string> {
  constructor(options: ElementStringProcessorOptions = {}) {
    super(
      {
        parser: stringParser(),
        name: NAME,
      },
      options,
    );
  }
}
