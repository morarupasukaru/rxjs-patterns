import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {EditedItemStoreService} from "./services/edited-item-store.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  private subscription?: Subscription;

  constructor(private router: Router,
              private modeService: EditedItemStoreService) {
  }

  ngOnInit(): void {
    this.subscription = this.modeService.editedItem$().subscribe(editItem => {
      let url;
      if (editItem) {
        url = 'item';
      } else {
        url = '';
      }
      this.router.navigateByUrl(url);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
