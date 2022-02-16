import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RootIndicatorComponent} from './components/root-indicator/root-indicator.component';
import {CommonModule} from '@angular/common';
import {IndicatorsComponent} from './components/indicators/indicators.component';
import {IndicatorComponent} from './components/indicator/indicator.component';
import {IndicatorHistoryComponent} from './components/indicator-history/indicator-history.component';
import {IndicatorHistoryStatusComponent} from './components/indicator-history-status/indicator-history-status.component';
import {RefreshComponent} from './components/refresh/refresh.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: RootIndicatorComponent},
  {path: 'indicators', component: IndicatorsComponent},
  {path: 'indicators/:id', component: IndicatorHistoryComponent},
];

@NgModule({
  declarations: [
    RootIndicatorComponent,
    IndicatorsComponent,
    IndicatorComponent,
    IndicatorHistoryComponent,
    IndicatorHistoryStatusComponent,
    RefreshComponent
  ],
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
