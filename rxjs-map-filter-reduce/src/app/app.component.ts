import {Component, OnInit} from '@angular/core';
import {lorem_ipsum_text} from "./constant";
import {from, Observable, of, zip} from "rxjs";
import {concatMap, count, filter, groupBy, map, mergeMap, toArray} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  inputText = lorem_ipsum_text;
  inputFilter = '';
  output$?: Observable<string[]>;

  constructor() {
  }

  ngOnInit(): void {
  }

  onSubmit() {
    const text$: Observable<string> = of(this.inputText);
    this.output$ = text$.pipe(
      // split text into words
      concatMap(text => from(text.split(/\s+/))),
      map(word => word.toLowerCase()),
      // apply filters
      filter(word => word.length > 0),
      filter(word => !this.inputFilter || word.indexOf(this.inputFilter) !== -1),
      // data reduce by applying a groupBy operator to get distinct words along with word count
      groupBy(word => word),
      mergeMap(group$ => zip(of(group$.key), group$.pipe(count()))),
      map(group => group[0] + ' (' + group[1] + ')'),
      // to array applied when the source observable complete
      toArray()
    );
  }
}
