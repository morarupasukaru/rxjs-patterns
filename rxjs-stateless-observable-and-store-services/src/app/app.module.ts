import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { AddItemButtonComponent } from './components/add-item-button/add-item-button.component';
import {EditIconComponent} from './components/edit-icon/edit-icon.component';
import {ShoppingListComponent} from './components/shopping-list/shopping-list.component';
import {EditItemComponent} from './components/edit-item/edit-item.component';
import {EditItemFormComponent} from './components/edit-item/edit-item-form/edit-item-form.component';
import {FormsModule} from '@angular/forms';
import {AppRoutingModule} from "./app.routing.module";

@NgModule({
  declarations: [
    AppComponent,
    EditIconComponent,
    ShoppingListComponent,
    EditItemComponent,
    AddItemButtonComponent,
    EditItemFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
