import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {IndicatorsService} from '../../services/indicators.service';
import {Indicator} from '../../models/indicator';
import {RefreshService} from '../../services/refresh.service';
import {concatMap} from 'rxjs/operators';

@Component({
  selector: 'app-indicators',
  templateUrl: './indicators.component.html',
  styleUrls: ['./indicators.component.css']
})
export class IndicatorsComponent implements OnInit {

  indicators$?: Observable<Indicator[]>;

  constructor(private indicatorsService: IndicatorsService,
              private refreshService: RefreshService) {
  }

  ngOnInit(): void {
    this.indicators$ = this.refreshService.getRefresh$().pipe(
      concatMap(() => this.indicatorsService.getIndicators$()),
    );
  }
}
