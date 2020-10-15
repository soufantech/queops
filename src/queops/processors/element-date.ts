import { dateParser } from './value-parsers';

import {
  ElementProcessorBase,
  ElementProcessorBaseOptions,
} from './base-element';

export type ElementDateProcessorOptions = ElementProcessorBaseOptions<Date>;

const NAME = 'ELEMENT_DATE';

export class ElementDateProcessor extends ElementProcessorBase<Date> {
  constructor(options: ElementDateProcessorOptions = {}) {
    super(
      {
        parser: dateParser(),
        name: NAME,
      },
      options,
    );
  }
}
