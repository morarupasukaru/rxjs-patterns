import {Step} from './step';
import {JobStatus} from './job-status';

export interface Job {
  name: string;
  status: JobStatus;
  steps: Step[];
}
