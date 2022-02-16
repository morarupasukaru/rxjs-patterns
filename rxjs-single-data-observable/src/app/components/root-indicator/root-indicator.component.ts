import {Component, OnInit} from '@angular/core';
import {IndicatorsService} from '../../services/indicators.service';
import {combineLatest, Observable} from 'rxjs';
import {Status} from '../../models/status';
import {concatMap, map} from 'rxjs/operators';
import {RefreshService} from '../../services/refresh.service';

interface Counts {
  count: number;
  failures: number;
}

@Component({
  selector: 'app-root-indicator',
  templateUrl: './root-indicator.component.html',
  styleUrls: ['./root-indicator.component.css']
})
export class RootIndicatorComponent implements OnInit {

  status$?: Observable<Status>;
  counts$?: Observable<Counts>;

  constructor(private indicatorsService: IndicatorsService,
              private refreshService: RefreshService) {
  }

  ngOnInit(): void {
    this.counts$ = this.refreshService.getRefresh$().pipe(
      concatMap(() => this.getSingleDataObservable$()),
    );
  }

  /**
   * "single data observable" RxJS pattern to merge several observables into a single one to ease use
   * their uses in component's template by calling a unique async pipe
   */
  private getSingleDataObservable$(): Observable<Counts> {
    this.status$ = this.indicatorsService.getRootIndicatorStatus$();
    const indicatorsCount$ = this.indicatorsService.getIndicatorsCount$();
    const failedIndicatorsCount$ = this.indicatorsService.getFailedIndicatorsCount$();
    return combineLatest([indicatorsCount$, failedIndicatorsCount$])
      .pipe(
        map(([indicatorsCount, failedIndicatorsCount]) => {
            return {
              count: indicatorsCount,
              failures: failedIndicatorsCount
            };
          }
        )
      );
  }
}
