import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {EditedItemStoreService} from '../../services/edited-item-store.service';
import {ItemsService} from '../../services/items.service';
import {Item} from '../../models/item';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  items$?: Observable<Item[]>;

  constructor(private modeService: EditedItemStoreService,
              private itemsService: ItemsService) {
  }

  ngOnInit(): void {
    this.items$ = this.itemsService.getItems$();
  }

  editItem(item: Item): void {
    this.modeService.edit(item);
  }
}
