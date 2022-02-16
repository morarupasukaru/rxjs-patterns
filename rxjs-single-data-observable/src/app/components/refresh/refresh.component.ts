import {Component, OnInit} from '@angular/core';
import {RefreshService} from '../../services/refresh.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-refresh',
  templateUrl: './refresh.component.html',
  styleUrls: ['./refresh.component.css']
})
export class RefreshComponent implements OnInit {

  countdownRefresh$?: Observable<number>;
  initialCountDownValue = 5;

  constructor(private refreshService: RefreshService) { }

  ngOnInit(): void {
    this.countdownRefresh$ = this.refreshService.getCountdownRefresh$();
  }
}
