import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { SpinnerComponent } from './spinner/spinner.component';
import { ArrowComponent } from './arrow/arrow.component';
import {DatePipe} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    ArrowComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
