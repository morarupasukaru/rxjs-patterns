import {Component, Input, OnInit} from '@angular/core';
import {Item} from '../../../models/item';
import {EditedItemStoreService} from '../../../services/edited-item-store.service';
import {ItemsService} from '../../../services/items.service';

@Component({
  selector: 'app-edit-item-form',
  templateUrl: './edit-item-form.component.html',
  styleUrls: ['./edit-item-form.component.css']
})
export class EditItemFormComponent {

  @Input() item: Partial<Item> = {};
  errorMessage = '';

  constructor(private modeService: EditedItemStoreService,
              private itemsService: ItemsService) { }

  saveItem(): void {
    if (this.item) {
      this.itemsService.saveItem$(this.item).subscribe(
        {
          next: () => this.modeService.leaveEdit(),
          error: () => {
            this.errorMessage = 'Error saving item';
          }
        }
      );
    }
  }

  deleteItem(): void {
    if (this.item?.id) {
      this.itemsService.deleteItem$(this.item?.id).subscribe(
        {
          next: () => this.modeService.leaveEdit(),
          error: () => {
            this.errorMessage = 'Error deleting item';
          }
        }
      );
    }
  }

  cancel(): void {
    this.modeService.leaveEdit();
  }
}
