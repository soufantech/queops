import { OffsetQueryFilter } from '../../query-filter';
import { BasePagingUriParamHandler } from './base-paging-uri-param-handler';

export class OffsetUriParamHandler extends BasePagingUriParamHandler {
  constructor() {
    super('offset', new OffsetQueryFilter(), { min: 0 });
  }
}
