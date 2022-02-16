import {Injectable} from '@angular/core';
import {BehaviorSubject, interval, Observable} from 'rxjs';
import {map, startWith, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {

  private refreshSubject = new BehaviorSubject<any>('refresh');

  constructor() {

  }

  getCountdownRefresh$(): Observable<number> {
    return interval(1000).pipe(
      startWith(5),
      map(count => 4 - count % 5),
      tap(count => {
        if (count === 0) {
        this.refreshSubject.next('refresh');
        }
      })
    );
  }

  getRefresh$(): Observable<any> {
    return this.refreshSubject.asObservable();
  }
}
