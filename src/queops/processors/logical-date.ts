import {
  LogicalProcessorBase,
  LogicalProcessorBaseOptions,
} from './base-logical';
import { dateParser } from './value-parsers';

export type LogicalDateProcessorOptions = LogicalProcessorBaseOptions<Date>;

const NAME = 'LOGICAL_DATE';

export class LogicalDateProcessor extends LogicalProcessorBase<Date> {
  constructor(options: LogicalDateProcessorOptions = {}) {
    super(
      {
        parser: dateParser(),
        name: NAME,
      },
      options,
    );
  }
}
