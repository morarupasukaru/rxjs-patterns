import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {concat, fromEvent, Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';

interface Line {
  nb: string;
  text: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  lines$?: Observable<Line[]>;
  @ViewChild('searchInput', { static: true }) input?: ElementRef;

  constructor(private http: HttpClient) {
  }

  ngAfterViewInit(): void {
    if (this.input) {
      const searchLines$ = fromEvent<KeyboardEvent>(this.input.nativeElement, 'keyup')
        .pipe(
          // get input value from event
          map((event: KeyboardEvent) => (event.target as HTMLInputElement).value),
          // delays the emissions of the source observable 'key event' of 400ms
          debounceTime(400),
          // returns an observable that emits all items emitted by the source observable that are distinct
          // by comparison from the previous item
          distinctUntilChanged(),
          // maps each value from source to an observable and flattens all of these inner observables using
          // switchAll (stop emmiting last observable before emitting a new one)
          switchMap(search => this.loadLines(search))
        );

      // get initial display data
      const initialLines$ = this.loadLines();

      // emit first the initial display data and then emit values after key events according to searchLines$ observable
      this.lines$ = concat(initialLines$, searchLines$);
    }
  }

  private loadLines(search: string = ''): Observable<Line[]> {
    return this.http.get<Line[]>(`/api?search=${search}`);
  }
}
