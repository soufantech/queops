import {
  QueryProjectionProcessorBaseOptions,
  QueryProjectionProcessorBase,
} from './base-projection';
import { createExcludeAction } from './actions';

export type QueryExcludeProcessorOptions = QueryProjectionProcessorBaseOptions;

const NAME = 'QUERY_EXCLUDE';

export class QueryExcludeProcessor extends QueryProjectionProcessorBase {
  constructor(options: QueryExcludeProcessorOptions = {}) {
    super(
      {
        createAction: createExcludeAction,
        name: NAME,
      },
      options,
    );
  }
}
