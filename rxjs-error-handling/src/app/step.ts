import {StepStatus} from './step-status';

export interface Step {
  status: StepStatus;
  text?: string;
}
