import { AuthenticationService } from 'shared/services/authentication.service';
import { Paginable } from './pagination';
import { ApiService } from 'shared/services/api.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  FilterParams,
  SearchOptions,
  DialogData,
  User,
  SendEmail,
  Configuration,
} from 'shared/interfaces';
import { Confirm, Toast } from 'shared/alerts';
import { DialogBase } from './dialog.base';
import jspdf from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ConfigurationService } from 'src/app/services/configuration.service'


export interface FilterOption<T> {
  label: string;
  property: keyof T;
}

export abstract class Catalog<T, U extends DialogBase> extends Paginable<T> {
  email: SendEmail;
  margin = { top: 0, right: 8, bottom: 0, left: 8 };

   configuration: Configuration

  /** The params that should be defined for loading and reloading entities */
  abstract params: FilterParams<T>;
  private assignedDefault = false;
  private defaultParams: FilterParams<T> = {};

  /** Object used to save the entity data when it's going to be saved as new */
  entity: T;
  /** Object used to save the entity data temporarily when it's going to be updated */
  temporal: T;
  dialogRef: MatDialogRef<U, T>;
  user: User;

  /** Var used to filtering the entity data */
  filter = false;
  abstract selectedOption: keyof T;
  /**
   * **Example:**
   * ```ts
   * export class UserComponent extends Catalog<User, CreateUserDialog> {
   *
   *  constructor() {
   *    this.filterOptions = [
   *      {
   *        label: 'Nombre',
   *        property: 'name'
   *      }
   *    ]
   *  }
   * }
   * ```
   */
  abstract filterOptions: FilterOption<T>[];
  private defaultKeys: (keyof FilterParams<T>)[] = [];
  search_ = '';

  constructor(
    public service: ApiService<T>,
    public auth: AuthenticationService,
    public dialog: MatDialog,
    public configurationService?: ConfigurationService

  ) {
    super(service, auth);
    this.user = JSON.parse(localStorage.getItem('user'));
    this.configuration = configurationService.configurationObject
    this.restore();
  }

  get filteredParams() {
    const { params, filterOptions } = this;
    const filtered = {};
    for (const key in params) {
      if (key in params) {
        const option = filterOptions.find(fop => fop.property == key);
        if (option) {
          filtered[key] = option.label;
        }
      }
    }
    return filtered;
  }
  openDialog(
    update: boolean = false,
    id?: number,
    readOnly: boolean = false,
    byField?: number,
    cancel: boolean = false,
    isListClientsWhithDebt?: boolean,
  ) {
    const catalog = update ? this.search(id) : this.entity;

    this.temporal = { ...catalog };

    const dialogData: DialogData<T> = {
      entity: catalog,
      temporal: this.temporal,
      options: { update, readonly: readOnly, cancel },
      extras: byField,
      configuration: this.configuration
    };
    this.dialogRef = this.getRefDialog(dialogData);
    
    this.dialogRef.afterClosed().subscribe((result: T | undefined) => {
      if (result) {
        // const dialogRef = this.dialog.open(LoadingComponent);
        result = this.validateExtras(result);
        if (update) {
          const index = this.entities.indexOf(catalog);
          const id_ = this.getIdFrom(result);
          if (cancel) {
            result['status'] = 'Cancelada';
          }
          this.service.update(id_, result).subscribe(
            response => {
              const message = 'Actualizado correctamente';
              if (index > -1) {
                this.entities[index] = response;
                if (!cancel) {
                  Toast.fire({
                    icon: 'success',
                    title: message,
                  });
                } else {
                  Toast.fire({
                    icon: 'success',
                    title: 'Venta cancelada correctamente',
                  });
                }
              }
              // dialogRef.close();
            },
            error => {
              Toast.fire({
                icon: 'error',
                title: 'Error en la actualización',
              });
              console.error(error);
              // dialogRef.close();
            }
          );
        } else {
          if (isListClientsWhithDebt) {
            this.service
              .listClientWithDebt(this.params)
              .subscribe(response => (this.entities = response.data.data));
          }
          else {
            this.service.store(result).subscribe(
              response => {
                const message = 'Agregado correctamente';
                this.reload(false,);
                Toast.fire({
                  icon: 'success',
                  title: message,
                });

                this.restore();
                // dialogRef.close();
              },
              error => {
                Toast.fire({
                  icon: 'error',
                  title: 'Error en la actualización',
                });
                console.error(error);
                // dialogRef.close();
              }
            );
          }
        }
      } else {
        if (update) {
          const index = this.entities.indexOf(catalog);
          this.entities[index] = this.temporal;
        } else {
          this.restore();
        }
      }
    });

    

  }


  public delete(id: number) {
    const msgtitle = '¿Estás seguro?';
    const msgtext = 'No será capaz de revertir esto';
    const btnConfirm = 'Confirmar';
    const btnCancel = 'Cancelar';
    Confirm.fire({
      title: msgtitle,
      text: msgtext,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: btnConfirm,
      cancelButtonText: btnCancel,
      reverseButtons: true,
    }).then(result => {
      if (result.value) {
        this.service.destroy(id).subscribe(
          response => {
            const message = 'Correcto!';
            const msgtext_ = 'Se eliminó correctamente';
            Toast.fire(message, msgtext_, 'success');
            this.reload(true);
          },
          error => Toast.fire('Error', 'Ocurrió un error al eliminar', 'error')
        );
      }
    });
  }

  toggleFilter() {
    this.filter = !this.filter;
    const { filterOptions } = this;
    if (this.filter) {
      if (filterOptions.length) {
        this.selectedOption = filterOptions[0].property;
        this.extractDefaultParams();
      }
    } else {
      this.restoreDefaultParams();
      this.selectedOption = undefined;
      this.reload(false,);
    }
  }

  cleanFilter() {
    this.restoreDefaultParams();
    this.selectedOption = undefined;
    this.filter = false;
    this.reload(false,);
  }

  private extractDefaultParams() {
    const { params, assignedDefault } = this;

    if (params && !assignedDefault) {
      Object.assign(this.defaultParams, params);
      this.assignedDefault = true;
    }

    this.params = {};

    if ('limit' in this.defaultParams) {
      this.params.limit = this.defaultParams.limit;
    }

    if ('rel' in this.defaultParams) {
      this.params.rel = this.defaultParams.rel;
    }

    this.defaultKeys.forEach(
      key => (this.params[key] = this.defaultParams[key])
    );
  }

  public setDefaultParam<K extends keyof FilterParams<T>>(
    key: K,
    value: FilterParams<T>[K]
  ) {
    this.defaultParams[key] = value;
    this.params[key] = value;
    this.defaultKeys.push(key);
  }

  private restoreDefaultParams() {
    this.params = {};
    Object.assign(this.params, this.defaultParams);
  }

  /**
   * This method is useful when you need to do extra validation to an entity.
   *
   * If there's no validation for this `entity: T`, the normal behaviour looks
   * like this:
   * ```ts
   * export class UserComponent extends Catalog<User, CreateUserDialog> {
   *  protected validateExtras(entity: User): User {
   *    return entity;
   *  }
   * }
   * ```
   */
  protected abstract validateExtras(entity: T): T;
  /**
   * Retrieves the `id` value from the given `entity: T`
   *
   * **Note:** This method normally behaves like this:
   * ```ts
   * export class UserComponent extends Catalog<User, CreateUserDialog> {
   *  protected getIdFrom(entity: User): string {
   *    return entity.id;
   *  }
   * }
   * ```
   *
   * The reason why this method is abstract is because it could vary which property
   * is the `id` of the type `<T>`
   */
  protected abstract getIdFrom(entity: T): number;
  /**
   * Searchs for an entity with the param `id` into the `this.entities` property
   *
   * **Note:** This method normally behaves like this:
   * ```ts
   *  this.entities.find(e => e.id == id);
   * ```
   *
   * The reason why this method is abstract is because it could vary which property
   * is the `id` of the type `<T>`
   */
  protected abstract search(id: number): T;
  protected abstract getRefDialog(
    dialogData: DialogData<T, any>
  ): MatDialogRef<U, T>;
  /**
   * This method consist on initialize the `entity: T` to the default values
   *
   * **Example:**
   * ```ts
   * export class UserComponent extends Catalog<User, CreateUserDialog> {
   *  protected restore(): void {
   *    this.entity = {
   *        id: '',
   *        name: '',
   *        password: ''
   *        // etc...
   *    }
   *  }
   * }
   * ```
   */
  protected abstract restore(): void;
}
