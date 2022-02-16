import {Component, Input, OnInit} from '@angular/core';
import {Indicator} from '../../models/indicator';
import {IndicatorStatus} from '../../models/indicator-status';
import {Status} from '../../models/status';

@Component({
  selector: 'app-indicator-history-status',
  templateUrl: './indicator-history-status.component.html',
  styleUrls: ['./indicator-history-status.component.css']
})
export class IndicatorHistoryStatusComponent implements OnInit {

  @Input()
  status?: IndicatorStatus;

  constructor() { }

  ngOnInit(): void {
  }

  getClass(): string {
    if (!this.status) {
      return 'unknown';
    }
    switch (this.status?.status) {
      case Status.OK:
        return 'ok';
      case Status.NOK:
        return 'nok';
      case Status.UNKNOWN:
        return 'unknown';
    }
  }
}
