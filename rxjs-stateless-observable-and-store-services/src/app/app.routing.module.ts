import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ShoppingListComponent} from "./components/shopping-list/shopping-list.component";
import {EditItemComponent} from "./components/edit-item/edit-item.component"; // CLI imports router

const routes: Routes = [
  { path: '', pathMatch: 'full', component: ShoppingListComponent },
  { path: 'item', component: EditItemComponent },
]; // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
