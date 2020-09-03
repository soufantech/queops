import { stringParser } from '../value-parser';
import {
  ElementUriParamHandler,
  ElementUriParamHandlerOptions,
} from './element-uri-param-handler';

export type ElementStringUriParamHandlerOptions = ElementUriParamHandlerOptions;

export class ElementStringUriParamHandler extends ElementUriParamHandler<
  string
> {
  constructor(field: string, options?: ElementStringUriParamHandlerOptions) {
    super(field, stringParser(), options);
  }
}
