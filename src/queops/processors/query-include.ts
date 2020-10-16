import {
  QueryProjectionProcessorBaseOptions,
  QueryProjectionProcessorBase,
} from './base-projection';
import { createIncludeAction } from './actions';

export type QueryIncludeProcessorOptions = QueryProjectionProcessorBaseOptions;

const NAME = 'QUERY_INCLUDE';

export class QueryIncludeProcessor extends QueryProjectionProcessorBase {
  constructor(options: QueryIncludeProcessorOptions = {}) {
    super(
      {
        createAction: createIncludeAction,
        name: NAME,
      },
      options,
    );
  }
}
