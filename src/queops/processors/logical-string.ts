import {
  LogicalProcessorBase,
  LogicalProcessorBaseOptions,
} from './base-logical';
import { stringParser } from './value-parsers';

export type LogicalStringProcessorOptions = LogicalProcessorBaseOptions<string>;

const NAME = 'LOGICAL_STRING';

export class LogicalStringProcessor extends LogicalProcessorBase<string> {
  constructor(options: LogicalStringProcessorOptions = {}) {
    super(
      {
        parser: stringParser(),
        name: NAME,
      },
      options,
    );
  }
}
