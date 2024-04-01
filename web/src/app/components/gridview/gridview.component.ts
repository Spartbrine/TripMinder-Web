import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Days } from 'shared/interfaces';

import { randomIntId } from 'shared/utils/generator';
import Swal from 'sweetalert2';
import { Toast } from 'shared/alerts';

interface Row {
  /** Equals to time: `row = hour` */
  row: string;
  hour: string;
  cols: Col[];
}

interface Col {
  row: string;
  col: number;
  type: 'hour' | keyof Days;
  content: Content;
}

interface Content {
  color: string;
  text: string;
  gradient: string;
  records: Record[];
  tooltip: boolean;
  border?: boolean;
  title?: string;
}

interface Record {
  type: 'schedule' | 'break';
}

interface DayDropped {
  [k: string]: DayConfig;
}

interface DayHours {
  [day: string]: HoursDisabled;
}

interface DayConfig {
  show: boolean;
  program?: string;
}

interface HoursDisabled {
  [hour: string]: boolean;
}

const hourRgx = /([0-9]{2}):([0-9]{2})/;

const breakColor = '#ABB2B9';
let $hours: string[] = [];


const toSeconds = (str: string) => {
  const match = hourRgx.exec(str);
  if (match && match.length) {
    const hours = parseInt(match[1], 10);
    const mins = parseInt(match[2], 10);
    return (hours * 3600) + (mins * 60);
  }
  return 0;
};

const toHHMMString = (seconds: number) => {
  const mins = seconds / 60;
  const hours = Math.trunc(mins / 60);
  const mmod = mins % 60;
  return `${hours}`.padStart(2, '0') + ':' + `${mmod}`.padStart(2, '0');
};

const getSubDay = (day: keyof Days) => {
  return Days[day].substring(0, 3);
};

@Component({
  selector: 'app-gridview-component',
  templateUrl: './gridview.component.html',
  styleUrls: ['./gridview.component.scss'],
})
export class GridViewComponent implements OnInit {
  @Input() title: string;

  @Input() isEditable: boolean;
  private _endTime: number;

  rows: Row[] = [];
  info: string;
  days: (keyof Days)[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  drops: DayDropped = {};
  dayHours: DayHours = {};
  constructor(
  ) { }


  ngOnInit() {
    console.log('just started: GridViewComponent');
    $hours = [];
    this.days.forEach(day => this.drops[day] = { show: false });
  }

  getDay(day: keyof Days) {
    return getSubDay(day);
  }


  dragDrop(event: DragEvent, col: Col) {
    event.preventDefault();
    this.info = '';
  }

  dropOnDay(event: DragEvent, day: keyof Days) {
    event.preventDefault();
    if (this.isEditable) {
      const drop = this.drops[day];
      drop.show = true;
      const id = event.dataTransfer.getData('text/plain');
    }
  }

  dragEnter(event: DragEvent, col: Col) {
    event.preventDefault();
    console.log('dragEnter:' + this.isEditable);
    if (this.isEditable) {
      const { row, type } = col;
      const day = Days[type as keyof Days].substring(0, 3);
      this.info = `${day} - ${row}`;
    }
  }

  dragLeave(event: DragEvent, col: Col) {
    // Nothing
  }

  clearInfo() {
    this.info = '';
  }
}

@Component({
  selector: 'app-tooltip-form',
  templateUrl: './tooltip-form.component.html',
  styleUrls: ['./gridview.component.scss'],
})
export class TooltipFormComponent implements OnInit {
  @Input() day: keyof Days;
  @Input() hidden: boolean;
  @Input() dropped: DayConfig;
  @Input() hoursDisabled: HoursDisabled;
  @Output() cancel = new EventEmitter<void>();
  modules: number;
  start: string;
  end: string;
  hours: string[];
  constructor() {}

  ngOnInit() {
    this.modules = 1;
    this.hours = $hours;
    setTimeout(() => {
      this.start = this.hours[0];
      this.validateEnd(this.start);
    }, 1500);
  }

  get startHours() {
    if (!this.hours) {
      return [];
    }
    return this.hours.filter(h => {
      const secs = toSeconds(h);
    });
  }

  onCancel() {
    this.cancel.emit();
    this.dropped.show = false;
  }

  onAccept() {
    
  }

  getDay(day: keyof Days) {
    return getSubDay(day);
  }

  validateEnd(val: any) {
    this.start = val;
    this.endByModules(this.modules);
  }

  endByModules(modules: any) {
    this.modules = modules;
    const { start } = this;

    const _start = toSeconds(start);
    const end = 0;
    this.end = toHHMMString(end);
  }
}
