import { ApiService } from 'shared/services/api.service';
import { FilterParams } from 'shared/interfaces';
import { AuthenticationService } from 'shared/services/authentication.service';
import { Authable } from './authable';

class CursorService {
  cursors: string[];

  constructor() {
    this.restore();
  }

  restore() {
    this.cursors = [null];
  }

  hasNext(): boolean {
    const size = this.cursors.length;
    return typeof this.cursors[size - 1] === 'string';
  }

  hasPrevious(): boolean {
    const size = this.cursors.length;
    return size > 2 && typeof this.cursors[size - 2] === 'string';
  }

  get lastCursor(): string {
    const size = this.cursors.length;
    return this.cursors[size - 1];
  }

  get previousCursor(): string {
    const size = this.cursors.length;
    let cursor = null;
    if (size >= 2) {
      cursor = this.cursors[size - 3];
      this.cursors = this.cursors.splice(0, size - 2);
    }
    return cursor;
  }

  get cursorToReload(): string {
    const size = this.cursors.length;
    let cursor = null;
    if (size > 1) {
      cursor = this.cursors.pop();
    }
    return cursor;
  }
}

export abstract class Paginable<T> extends Authable implements Pagination<T> {
  private readonly cursorSvc: CursorService;
  private callback?: () => any;
  entities: T[] = [];
  prev: string;
  next: string;
  constructor(
    private service$: ApiService<T>,
    private authsvc: AuthenticationService
  ) {
    super(authsvc);
    this.cursorSvc = new CursorService();
    this.entities = [];
    this.logged = typeof this.authsvc.currentUserValue === 'string' &&
      this.authsvc.currentUserValue !== '';
  }

  abstract params: FilterParams<T>;

  reload(isForDelete: boolean = false, params: FilterParams<T> = this.params || {}, callback?: () => any): void {
    if(!isForDelete){
      params['page'] = null
    }
    this.callback = callback;
    this.cursorSvc.restore();
    delete params['cursor'];
    const { limit } = params;
    this.service$.list(params)
      .subscribe(listWCursor => {
        this.entities = listWCursor.data.data;
        if(params['id_agent_saleCanceled']){
          this.entities = this.entities.filter(element => element['sale'].id_agent == params['id_agent_saleCanceled'])
        }
        this.prev = listWCursor.data.prev_page_url;
        this.next = listWCursor.data.next_page_url;
        // if (limit) {
        //   this.addCursor(this.entities.length < limit ? null : listWCursor.cursor);
        // } else {
        //   this.addCursor(listWCursor.cursor);
        // }
        if (callback) {
          callback();
        }
      });
  }

  refresh(params: FilterParams<T> = this.params || {}): void {
    params.cursor = this.cursorSvc.cursorToReload;
    const { limit } = params;
    this.service$.list(params)
      .subscribe(listWCursor => {
        this.entities = listWCursor.data.data;
        this.prev = listWCursor.data.prev_page_url;
        this.next = listWCursor.data.next_page_url;
        // if (limit) {
        //   this.addCursor(this.entities.length < limit ? null : listWCursor.cursor);
        // } else {
        //   this.addCursor(listWCursor.cursor);
        // }
        if (this.callback) {
          this.callback();
        }
      });
  }

  nextPage(params: FilterParams<T> = this.params || {}): void {
    if (!this.next) return;
    const regex = /^(page=)([0-9]+)/i;
    
    let b = this.next.split('?')[0];
    b = b.split('api/')[1]
    const t = this.next.split('?')[1];
    const a = t.match(regex);
    
    try{
      params['page'] = a[2];
    }
    catch{
      let paramsArray = t.split('&')
      const x = paramsArray[paramsArray.length - 1]
      const z = x.match(regex);
      params['page'] = z[2];
    }
    

    params.cursor = this.cursorSvc.lastCursor;
    const { limit } = params;
    if(b != 'accounts/clients/clientswithdebt'){
      this.service$.list(params)
      .subscribe(listWCursor => {
        this.entities = listWCursor.data.data;
        this.prev = listWCursor.data.prev_page_url;
        this.next = listWCursor.data.next_page_url;
        // if (limit) {
        //   this.addCursor(this.entities.length < limit ? null : listWCursor.cursor);
        // } else {
        //   this.addCursor(listWCursor.cursor);
        // }
        if (this.callback) {
          this.callback();
        }
      });
    }
    else{
      this.service$.listClientWithDebt(params)
      .subscribe(listWCursor => {
        this.entities = listWCursor.data.data;
        this.prev = listWCursor.data.prev_page_url;
        this.next = listWCursor.data.next_page_url;
        // if (limit) {
        //   this.addCursor(this.entities.length < limit ? null : listWCursor.cursor);
        // } else {
        //   this.addCursor(listWCursor.cursor);
        // }
        if (this.callback) {
          this.callback();
        }
      });
    }
    
  }

  previousPage(params: FilterParams<T> = this.params || {}): void {
    params.cursor = this.cursorSvc.previousCursor;
    if (!this.prev) return;
    const regex = /^(page=)([0-9]+)/i;

    let b = this.prev.split('?')[0];
    b = b.split('api/')[1]
    const t = this.prev.split('?')[1];
    const a = t.match(regex);
    try{
      params['page'] = a[2];
    }
    catch{
      let paramsArray = t.split('&')
      const x = paramsArray[paramsArray.length - 1]
      const z = x.match(regex);
      params['page'] = z[2];
    }
    const { limit } = params;
    if(b != 'accounts/clients/clientswithdebt'){
      this.service$.list(params)
      .subscribe(listWCursor => {
        this.entities = listWCursor.data.data;
        this.prev = listWCursor.data.prev_page_url;
        this.next = listWCursor.data.next_page_url;
        // if (limit) {
        //   this.addCursor(this.entities.length < limit ? null : listWCursor.cursor);
        // } else {
        //   this.addCursor(listWCursor.cursor);
        // }
        if (this.callback) {
          this.callback();
        }
      });
    }
    else{
      this.service$.listClientWithDebt(params)
      .subscribe(listWCursor => {
        this.entities = listWCursor.data.data;
        this.prev = listWCursor.data.prev_page_url;
        this.next = listWCursor.data.next_page_url;
        // if (limit) {
        //   this.addCursor(this.entities.length < limit ? null : listWCursor.cursor);
        // } else {
        //   this.addCursor(listWCursor.cursor);
        // }
        if (this.callback) {
          this.callback();
        }
      });
    }
    
  }

  hasNext(): boolean {
    // return this.cursorSvc.hasNext();
    return this.next !== null;
  }

  hasPrevious(): boolean {
    // return this.cursorSvc.hasPrevious();
    return this.prev !== null;
  }

  addCursor(cursor: string) {
    this.cursorSvc.cursors.push(cursor);
  }
}

export interface Pagination<T> {
  reload(isForDelete: boolean, params?: FilterParams<T>): void;
  refresh(params?: FilterParams<T>): void;
  nextPage(params?: FilterParams<T>): void;
  previousPage(params?: FilterParams<T>): void;
  hasNext(): boolean;
  hasPrevious(): boolean;
  addCursor(cursor: string): void;
}
