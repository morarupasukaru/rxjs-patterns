import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, Subject, throwError, timer} from 'rxjs';
import {ulid} from 'ulid';
import {catchError, delayWhen, finalize, mergeMap, retryWhen, tap} from 'rxjs/operators';
import {DatePipe} from '@angular/common';
import {Step} from './step';
import {StepStatus} from './step-status';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingStrategyService {

  constructor(private http: HttpClient,
              private datePipe: DatePipe) {
  }

  public noneStrategyWithSuccess$(): Observable<string> {
    return this.http.get('/api/success/' + ulid(), {responseType: 'text'});
  }

  public noneStrategyWithError$(): Observable<string> {
    return this.http.get('/api/error/' + ulid(), {responseType: 'text'});
  }

  public catchAndRetrow$(): Observable<string> {
    const source$ = this.http.get('/api/error/' + ulid(), {responseType: 'text'});
    return source$.pipe(
      catchError(
        error => {
          console.error(`cath error '${error.error}' and rethrow it`);
          return throwError(error);
        }
      )
    );
  }

  public catchAndReplace$(): Observable<string> {
    const source$ = this.http.get('/api/error/' + ulid(), {responseType: 'text'});
    return source$.pipe(
      catchError(
        error => {
          console.error(`cath error '${error.error}' and replace it`);
          return of(`${error.error} replaced`);
        }
      )
    );
  }

  public immediateRetry$(stepSubject: Subject<Step>): Observable<string> {
    const source$ = this.http.get('/api/n-errors-then-success/' + ulid(), {responseType: 'text'});
    const immediateRetry$ = source$.pipe(
      retryWhen(errors => errors.pipe(
        tap((value) => {
          stepSubject.next({status: StepStatus.ERROR, text: value.error});
          console.log(this.now() + ' - retrying...');
          stepSubject.next({status: StepStatus.LOADING});
        })
      ))
    );

    return immediateRetry$.pipe(tap({
      next: value => {
        stepSubject.complete();
      },
      error: err => {
        stepSubject.complete();
      }
    }));
  }

  public delayedRetry$(stepSubject: Subject<Step>): Observable<string> {
    const source$ = this.http.get('/api/n-errors-then-success/' + ulid(), {responseType: 'text'});
    const delayedRetry$ = source$.pipe(
      retryWhen(
        errors => errors.pipe(
          tap((value) => {
            stepSubject.next({status: StepStatus.ERROR, text: value.error});
            console.log(this.now() + ' - error');
          }),
          delayWhen((_, i) => {
            const waitS = i + 1;
            stepSubject.next({status: StepStatus.WAITING, text: `Wait ${waitS}s`});
            return timer(waitS * 1000);
          }),
          tap(() => {
            console.log(this.now() + ' - retrying...');
            stepSubject.next({status: StepStatus.LOADING});
          }),
        )
      )
    );

    return delayedRetry$.pipe(tap({
      next: value => {
        stepSubject.complete();
      },
      error: err => {
        stepSubject.complete();
      }
    }));
  }

  private now(): string | null {
    return this.datePipe.transform(new Date(), 'HH:mm:ss.SSS');
  }

  public delayedRetryWithMaxRetry$(maxRetries: number, stepSubject: Subject<Step>): Observable<string> {
    // solution from https://www.learnrxjs.io/learn-rxjs/operators/error_handling/retrywhen
    const source$ = this.http.get('/api/n-errors-then-success/' + ulid(), {responseType: 'text'});
    const scalingDuration = 1000;
    const delayedRetry$ = source$.pipe(
      retryWhen(errors => errors.pipe(
        mergeMap((error, i) => {
          const retryAttempt = i + 1;
          if (retryAttempt > maxRetries) {
            return throwError(error);
          } else {
            console.log(this.now() + ' - error');
            stepSubject.next({status: StepStatus.ERROR, text: error.error});
          }
          const waitMs = retryAttempt * scalingDuration;
          console.log(this.now() + ' - retrying...');
          stepSubject.next({status: StepStatus.WAITING, text: `Wait ${waitMs / 1000}s`});
          return timer(waitMs).pipe(
            tap(() => {
              stepSubject.next({status: StepStatus.LOADING});
            })
          );
        }),
        finalize(() => {
          console.log('maxRetries reached!');
        })
      )),
      catchError(error => {
        return throwError(error);
      }));

    return delayedRetry$.pipe(tap({
      next: value => {
        stepSubject.complete();
      },
      error: err => {
        stepSubject.complete();
      }
    }));
  }
}
