import {Component, Input} from '@angular/core';
import {Indicator} from '../../models/indicator';
import {Status} from '../../models/status';
import {IndicatorsService} from '../../services/indicators.service';

@Component({
  selector: 'app-indicator',
  templateUrl: './indicator.component.html',
  styleUrls: ['./indicator.component.css']
})
export class IndicatorComponent {

  @Input()
  indicator?: Indicator;

  constructor(private indicatorsService: IndicatorsService) {
  }

  getClass(): string {
    const status = this.indicatorsService.getLastIndicatorStatus(this.indicator);
    switch (status) {
      case Status.OK:
        return 'ok';
      case Status.NOK:
        return 'nok';
      case Status.UNKNOWN:
        return 'unknown';
    }
  }

  getMessage(): string {
    const status = this.indicatorsService.getLastIndicatorStatus(this.indicator);
    switch (status) {
      case Status.OK:
        return 'is green';
      case Status.NOK:
        return 'is red!';
      case Status.UNKNOWN:
        return 'is n/a';
    }
  }

  getRouterLink(): string {
    return '' + this.indicator?.id;
  }
}
