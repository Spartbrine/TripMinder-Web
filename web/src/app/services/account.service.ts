import { Injectable, Inject } from '@angular/core';
import { Account, FilterParams, ListWCursor, SortOrder, Range, WhereIn, ActiveAccount, GenericResponse, TotalPaid } from 'shared/interfaces';
import { ApiService } from 'shared/services/api.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
// import { moment } from 'ngx-bootstrap/chronos/testing/chain';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})

export class AccountService extends ApiService<Account>{
  constructor(http: HttpClient) {
    super(http);
  }

  public root(): string {
    return 'accounts';
  }

  public getDebtClient(id_client: number): Observable<Account> {
    return this.http.get<Account>(`${this.uri}/debtclient/${id_client}`);
  }

  public actives(params?: FilterParams<ActiveAccount>): Observable<GenericResponse<ActiveAccount[]>> {
    return this.http.get<GenericResponse<ActiveAccount[]>>(`${this.uri}/actives/get`, { params: getParams(params) });
  }

  public getTotalPaidById(id_account: number): Observable<TotalPaid>{
    return this.http.get<TotalPaid>(`${this.uri}/totalpaid/${id_account}`);
  }
}

function isNullEmptyOrZero(value: any): boolean {
  switch (value) {
    case undefined:
    case null:
    case '':
    case 0:
      return true;
    default:
      return false;
  }
}

export function getParams<T>(params?: FilterParams<T>): HttpParams {
  const options = Object.assign({}, params) as FilterParams<T>;
  let hp: HttpParams = new HttpParams();

  if ('in' in options) {
    const wIn: WhereIn<T> = options['in'] as WhereIn<T>;
    delete options[wIn.field];
  }

  Object.keys(options)
    .filter(key => !isNullEmptyOrZero(options[key]))
    .forEach(key => {
      let value = `${options[key]}`;
      if (key as keyof FilterParams<T> === 'orderBy') {
        const orderBy: SortOrder<T> = options[key] as SortOrder<T>;
        const sign = orderBy.order === 'asc' ? '~' : '-';
        value = `${sign}${orderBy.field}`;
      }
      if (key as keyof FilterParams<T> === 'in') {
        const whereIn: WhereIn<T> = options[key] as WhereIn<T>;
        value = `${whereIn.field}(${whereIn.values.toString()})`;
      }
      if (key as keyof FilterParams<T> === 'range') {
        value = '';
        const range: Range<T> = options[key] as Range<T>;
        const { field, start, end } = range;
        const i = range.nonInclusive ? '*' : '';
        if (typeof start === typeof end) {
          switch (typeof start) {
            case 'string':
            case 'number':
              value = `${i + field}^${start}~${end}`;
              break;
            case 'object': {
              const $start = moment(start).format('YYYY-MM-DD');
              const $end = moment(end).format('YYYY-MM-DD');
              value = `${i + field}^${$start}~${$end}`;
              break;
            }
          }
        }
      }
      hp = hp.set(key, value);
    });
  return hp;
}