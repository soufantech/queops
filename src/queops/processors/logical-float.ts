import {
  LogicalProcessorBase,
  LogicalProcessorBaseOptions,
} from './base-logical';
import { floatParser } from './value-parsers';

export type LogicalFloatProcessorOptions = LogicalProcessorBaseOptions<number>;

const NAME = 'LOGICAL_FLOAT';

export class LogicalFloatProcessor extends LogicalProcessorBase<number> {
  constructor(options: LogicalFloatProcessorOptions = {}) {
    super(
      {
        parser: floatParser(),
        name: NAME,
      },
      options,
    );
  }
}
