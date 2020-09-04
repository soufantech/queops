import { LimitQueryFilter } from '../../query-filter';
import { BasePagingUriParamHandler } from './base-paging-uri-param-handler';

export class LimitUriParamHandler extends BasePagingUriParamHandler {
  constructor() {
    super('limit', new LimitQueryFilter(), { min: 1 });
  }
}
