import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Item} from '../models/item';
import {HttpClient} from '@angular/common/http';

/**
 * Service based on stateless observable service: a service providing API using Observables and that
 * does not persist any data (stateless).
 */
@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  readonly URL_API = '/api/shopping-list/items';

  constructor(private http: HttpClient) { }

  public getItems$(): Observable<Item[]> {
    return this.http.get<Item[]>(this.URL_API);
  }

  public saveItem$(item: Partial<Item>): Observable<any> { // return Observable?
    if (item.id) {
      return this.http.put(this.URL_API + '/' + item.id, item);
    } else {
      return this.http.post(this.URL_API, item);
    }
  }

  public deleteItem$(itemId: number): Observable<any> {
    return this.http.delete(this.URL_API + '/' + itemId);
  }
}
