import { integerParser } from '../value-parser';
import { LogicalUriParamHandler } from './logical-uri-param-handler';

export class LogicalIntUriParamHandler extends LogicalUriParamHandler<number> {
  constructor(field: string) {
    super(field, integerParser());
  }
}
