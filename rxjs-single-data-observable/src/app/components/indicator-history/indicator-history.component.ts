import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {concatMap, map, take} from 'rxjs/operators';
import {IndicatorsService} from '../../services/indicators.service';
import {Observable} from 'rxjs';
import {Indicator} from '../../models/indicator';
import {RefreshService} from '../../services/refresh.service';

@Component({
  selector: 'app-indicator-history',
  templateUrl: './indicator-history.component.html',
  styleUrls: ['./indicator-history.component.css']
})
export class IndicatorHistoryComponent implements OnInit {

  indicator$?: Observable<Indicator>;

  constructor(private route: ActivatedRoute,
              private indicatorsService: IndicatorsService,
              private refreshService: RefreshService) {
  }

  ngOnInit(): void {
    this.indicator$ = this.refreshService.getRefresh$().pipe(
      concatMap(() => this.getIndicator$()),
    );
  }

  private getIndicator$(): Observable<Indicator> {
      return this.getId$().pipe(
        concatMap(id => this.indicatorsService.getIndicator$(id)),
        map(indicator => {
          return { ...indicator, status: indicator.status.reverse()};
        }),
      );
  }

  private getId$(): Observable<number> {
    return this.route.params.pipe(
      map(params => params.id),
      take(1));
  }
}
