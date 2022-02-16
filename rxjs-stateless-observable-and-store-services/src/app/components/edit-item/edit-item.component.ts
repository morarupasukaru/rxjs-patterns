import {Component, OnInit} from '@angular/core';
import {EditedItemStoreService} from '../../services/edited-item-store.service';
import {Observable} from 'rxjs';
import {Item} from '../../models/item';
import {ItemsService} from '../../services/items.service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit {

  editedItem$?: Observable<Partial<Item> | null>;

  constructor(private modeService: EditedItemStoreService,
              private itemsService: ItemsService) { }

  ngOnInit(): void {
    this.editedItem$ = this.modeService.editedItem$();
  }
}
