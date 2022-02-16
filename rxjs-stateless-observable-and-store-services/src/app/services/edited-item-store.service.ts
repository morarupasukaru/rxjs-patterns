import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Item} from '../models/item';

/**
 * Service based on store service pattern : a service hiding a state/data behind a simple API using
 * Observables; typically implemented with BehaviourSubject
 */
@Injectable({
  providedIn: 'root'
})
export class EditedItemStoreService {

  private editedItemSubject = new BehaviorSubject<Partial<Item> | null>(null);

  constructor() { }

  public editedItem$(): Observable<Partial<Item> | null> {
    return this.editedItemSubject.asObservable();
  }

  public edit(item: Partial<Item>): void {
    this.editedItemSubject.next({ ... item });
  }

  public leaveEdit(): void {
    this.editedItemSubject.next(null);
  }
}
