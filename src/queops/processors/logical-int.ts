import {
  LogicalProcessorBase,
  LogicalProcessorBaseOptions,
} from './base-logical';
import { integerParser } from './value-parsers';

export type LogicalIntProcessorOptions = LogicalProcessorBaseOptions<number>;

const NAME = 'LOGICAL_INT';

export class LogicalIntProcessor extends LogicalProcessorBase<number> {
  constructor(options: LogicalIntProcessorOptions = {}) {
    super(
      {
        parser: integerParser(),
        name: NAME,
      },
      options,
    );
  }
}
