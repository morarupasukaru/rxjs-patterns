import {Component, OnInit} from '@angular/core';
import {JobService} from './job.service';
import {Observable} from 'rxjs';
import {Job} from './job';
import {JobStatus} from './job-status';
import {StepStatus} from './step-status';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  JobStatus = JobStatus;
  StepStatus = StepStatus;

  jobs$?: Observable<Job[]>;

  constructor(private jobService: JobService) {
  }

  ngOnInit(): void {
    this.jobs$ = this.jobService.getJobs$();
  }

  start(): void {
    this.jobService.startJobs();
  }

  isStartDisabled(jobs: Job[]) {
    return jobs.find(j => j.status === JobStatus.RUNNING);
  }
}
