import {Injectable} from '@angular/core';
import {ErrorHandlingStrategyService} from './error-handling-strategy.service';
import {BehaviorSubject, combineLatest, concat, Observable, of, Subject} from 'rxjs';
import {Job} from './job';
import {catchError, map} from 'rxjs/operators';
import {StepStatus} from './step-status';
import {Strategy} from './strategies';
import {JobStatus} from './job-status';
import {Step} from './step';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  private readonly notStartedJobs = [
    {name: Strategy.NONE_WITH_SUCCESS, status: JobStatus.NOT_STARTED, steps: []},
    {name: Strategy.NONE_WITH_ERROR, status: JobStatus.NOT_STARTED, steps: []},
    {name: Strategy.CATCH_AND_RETHROW, status: JobStatus.NOT_STARTED, steps: []},
    {name: Strategy.CATCH_AND_REPLACE, status: JobStatus.NOT_STARTED, steps: []},
    {name: Strategy.IMMEDIATE_RETRY, status: JobStatus.NOT_STARTED, steps: []},
    {name: Strategy.DELAYED_RETRY, status: JobStatus.NOT_STARTED, steps: []},
    {name: Strategy.DELAYED_MAXRETRY, status: JobStatus.NOT_STARTED, steps: []},
  ];

  private jobsSubject = new BehaviorSubject<Job[]>(this.notStartedJobs);

  constructor(private errorHandlingStrategyService: ErrorHandlingStrategyService) {
  }

  getJobs$(): Observable<Job[]> {
    return this.jobsSubject.asObservable();
  }

  startJobs(): void {
    this.jobsSubject.next(this.notStartedJobs);

    const immediateRetrySubject = new Subject<Step>();
    const delayedRetrySubject = new Subject<Step>();
    const delayedRetryWithMaxRetrySubject = new Subject<Step>();

    concat(
      this.startJob$(Strategy.NONE_WITH_SUCCESS, this.errorHandlingStrategyService.noneStrategyWithSuccess$()),
      this.startJob$(Strategy.NONE_WITH_ERROR, this.errorHandlingStrategyService.noneStrategyWithError$()),
      this.startJob$(Strategy.CATCH_AND_RETHROW, this.errorHandlingStrategyService.catchAndRetrow$()),
      this.startJob$(Strategy.CATCH_AND_REPLACE, this.errorHandlingStrategyService.catchAndReplace$()),
      this.startJobWithRetries$(Strategy.IMMEDIATE_RETRY,
        this.errorHandlingStrategyService.immediateRetry$(immediateRetrySubject),
        immediateRetrySubject.asObservable()),
      this.startJobWithRetries$(Strategy.DELAYED_RETRY,
        this.errorHandlingStrategyService.delayedRetry$(delayedRetrySubject),
        delayedRetrySubject.asObservable()),
      this.startJobWithRetries$(Strategy.DELAYED_MAXRETRY,
        this.errorHandlingStrategyService.delayedRetryWithMaxRetry$(2, delayedRetryWithMaxRetrySubject),
        delayedRetryWithMaxRetrySubject.asObservable())
    ).subscribe(job => {
      this.jobsSubject.next(this.mergeJobs(this.jobsSubject.getValue(), job));
    });
  }

  mergeJobs(jobs: Job[], newJob: Job): Job[] {
    const index = jobs.findIndex(j => j.name === newJob.name);
    const result = [...jobs];
    if (index !== -1) {
      result[index] = newJob;
    } else {
      result.push(newJob);
    }
    return result;
  }

  private startJob$(jobName: string, source$: Observable<string>): Observable<Job> {
    const steps = [{status: StepStatus.LOADING}];
    const job = {
      name: jobName,
      status: JobStatus.RUNNING,
      steps,
    };

    const job$ = source$.pipe(
      map((res: string) => {
        return {
          name: jobName,
          status: JobStatus.TERMINATED,
          steps: [{status: StepStatus.SUCCESS, text: res}]
        };
      }),
      catchError(err => of({
        name: jobName,
        status: JobStatus.TERMINATED,
        steps: [{status: StepStatus.ERROR, text: err.error}]
      }))
    );

    return concat(of(job), job$);
  }

  private startJobWithRetries$(jobName: string, source$: Observable<string>, step$: Observable<Step>): Observable<Job> {
    let steps = [{status: StepStatus.LOADING}];
    const job = {
      name: jobName,
      status: JobStatus.RUNNING,
      steps,
    };

    const sourceWithInitialValue$ = concat(of(undefined), source$);
    const job$ = combineLatest([sourceWithInitialValue$, step$]).pipe(
      map(([result, step]) => {
        const status = result ? JobStatus.TERMINATED : JobStatus.RUNNING;
        if (status === JobStatus.TERMINATED) {
          steps = this.mergeSteps(steps, {status: StepStatus.SUCCESS, text: result});
        } else {
          steps = this.mergeSteps(steps, step);
        }
        return {
          name: jobName,
          status,
          steps
        };
      }),
      catchError(err => {
          steps = this.mergeSteps(steps, {status: StepStatus.ERROR, text: err.error});
          return of({
            name: jobName,
            status: JobStatus.TERMINATED,
            steps
          });
        }
      )
    );

    return concat(of(job), job$);
  }

  private mergeSteps(steps: Step[], newStepValue: Step): Step[] {
    const result = [...steps];
    const indexLoadingStep = steps.findIndex(s => s.status === StepStatus.LOADING);
    if (newStepValue.status !== StepStatus.LOADING && indexLoadingStep !== -1) {
      result[indexLoadingStep] = newStepValue;
    } else {
      result.push(newStepValue);
    }
    return result;
  }
}
