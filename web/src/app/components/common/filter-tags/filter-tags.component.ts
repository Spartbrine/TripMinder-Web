import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FilterParams } from 'shared/interfaces';
import { FilterOption } from 'shared/helpers/catalog';

@Component({
  selector: 'app-filter-tags',
  templateUrl: './filter-tags.component.html',
  styleUrls: ['./filter-tags.component.scss']
})
export class FilterTagsComponent<T> implements OnInit {
  @Input() params: FilterParams<T>;
  @Input() filterOptions: FilterOption<T>[];
  @Input() selectedOption: keyof T | undefined;
  @Output() removedParam = new EventEmitter<boolean>();
  constructor() {}
  ngOnInit() {}
  get filteredParams() {
    const { params, filterOptions } = this;
    const filtered: FilterOption<T>[] = [];
    for (const key in params) {
      if (key in params) {
        const option = filterOptions.find(fop => fop.property == key);
        if (option) {
          filtered.push(option);
        }
      }
    }
    return filtered;
  }

  remove(param: FilterOption<T>) {
    if (param.property in this.params) {
      delete this.params[param.property];
      this.removedParam.emit(true);
    }
  }
}
