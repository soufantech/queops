import { ExcludeFieldsQueryFilter } from '../../query-filter';
import {
  BaseProjectionUriParamHandler,
  BaseProjectionUriParamHandlerOptions,
} from './base-projection-uri-param-handler';

export type ExcludeUriParamHandlerOptions = BaseProjectionUriParamHandlerOptions;

export class ExcludeUriParamHandler extends BaseProjectionUriParamHandler {
  constructor(options?: ExcludeUriParamHandlerOptions) {
    super('exclude', new ExcludeFieldsQueryFilter(), options);
  }
}
