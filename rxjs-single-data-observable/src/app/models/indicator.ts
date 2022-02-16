import {IndicatorStatus} from './indicator-status';
import {IdName} from './id-name';

export interface Indicator extends IdName {
  status: IndicatorStatus[];
}
