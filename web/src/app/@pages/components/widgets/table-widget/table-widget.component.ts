import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'table-widget',
  templateUrl: './table-widget.component.html',
  styleUrls: ['./table-widget.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TableWidgetComponent implements OnInit {
  _titleText: string;
  _titleValue: string;
  _data: any[];
  constructor() {}
  @Input()
  set Title(value: string) {
    this._titleText = value;
  }
  get Title() {
    return this._titleText;
  }
  @Input()
  set TitleValue(value: string) {
    this._titleValue = value;
  }
  get TitleValue() {
    return this._titleValue;
  }
  @Input()
  set Data(value: any[]) {
    this._data = value;
  }
  get Data() {
    return this._data;
  }
  ngOnInit() {}
}
