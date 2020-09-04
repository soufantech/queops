import { IncludeFieldsQueryFilter } from '../../query-filter';
import {
  BaseProjectionUriParamHandler,
  BaseProjectionUriParamHandlerOptions,
} from './base-projection-uri-param-handler';

export type IncludeUriParamHandlerOptions = BaseProjectionUriParamHandlerOptions;

export class IncludeUriParamHandler extends BaseProjectionUriParamHandler {
  constructor(options?: IncludeUriParamHandlerOptions) {
    super('include', new IncludeFieldsQueryFilter(), options);
  }
}
