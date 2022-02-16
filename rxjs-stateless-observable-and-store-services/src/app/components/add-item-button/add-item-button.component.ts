import {Component} from '@angular/core';
import {EditedItemStoreService} from '../../services/edited-item-store.service';

@Component({
  selector: 'app-add-item-button',
  templateUrl: './add-item-button.component.html',
  styleUrls: ['./add-item-button.component.css']
})
export class AddItemButtonComponent {

  constructor(private modeService: EditedItemStoreService) { }

  editNewItem(): void {
    this.modeService.edit({ quantity: 1});
  }
}
