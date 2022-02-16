import {Injectable} from '@angular/core';
import {IdName} from '../models/id-name';
import {Indicator} from '../models/indicator';
import {from, Observable, of} from 'rxjs';
import {Status} from '../models/status';
import {concatMap, count, filter, map, mergeMap, toArray} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IndicatorsService {

  constructor(private http: HttpClient) {
  }

  public getIndicatorsCount$(): Observable<number> {
    return this.getIndicatorsIdName$().pipe(
      map(indicators => indicators.length)
    );
  }

  public getRootIndicatorStatus$(): Observable<Status> {
    return this.getIndicatorsAsSingleValue$().pipe(
      map(indicator => this.getLastIndicatorStatus(indicator)),
      toArray(),
      map(status => status.includes(Status.NOK) ? Status.NOK : Status.OK)
    );
  }

  public getFailedIndicatorsCount$(): Observable<number> {
    return this.getIndicatorsAsSingleValue$().pipe(
      map(indicator => this.getLastIndicatorStatus(indicator)),
      filter(status => status !== Status.OK),
      count()
    );
  }

  private getIndicatorsAsSingleValue$(): Observable<Indicator> {
    return this.getIndicators$().pipe(
      concatMap(indicators => from(indicators)),
    );
  }

  public getLastIndicatorStatus(indicator?: Indicator): Status {
    if (!indicator) {
      return Status.UNKNOWN;
    }

    const statusLength = indicator?.status?.length;
    if (!statusLength) {
      return Status.UNKNOWN;
    }

    return indicator?.status[statusLength - 1]?.status;
  }

  public getIndicators$(): Observable<Indicator[]> {
    return this.getIndicatorsIdName$().pipe(
      concatMap(idNames => from(idNames)),
      mergeMap(idName => this.getIndicator$(idName.id)),
      toArray()
    );
  }

  public getIndicator$(id: number): Observable<Indicator> {
    return this.http.get<Indicator>('/api/indicators/' + id);
  }

  public getIndicatorsIdName$(): Observable<IdName[]> {
    return this.http.get<IdName[]>('/api/indicators');
  }
}
