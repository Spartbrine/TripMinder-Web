import { Component, OnInit, Inject, NgModule } from '@angular/core';
import { DialogBase } from 'shared/helpers/dialog.base';
import { Catalog, FilterOption } from 'shared/helpers/catalog';
import { User,FuelType,DialogData,FilterParams,} from 'shared/interfaces';
import { AuthenticationService } from 'shared/services/authentication.service';
import { MatDialogRef,MatDialog,MAT_DIALOG_DATA,} from '@angular/material/dialog';
import { FuelTypeService } from 'src/app/services/fuel-type.service';
import { Profile } from 'shared/constants';
import { ConfigurationService } from 'src/app/services/configuration.service';

@Component({
  selector: 'app-fuel-type',
  templateUrl: './fuel-type.component.html',
  styleUrls: ['./fuel-type.component.scss']
})
export class FuelTypeComponent 
extends Catalog<FuelType, FuelTypeDialogComponent>
implements OnInit {
  params: FilterParams<FuelType>;
  filterOptions: FilterOption<FuelType>[];
  selectedOption: keyof FuelType | any;

  constructor(
    public service: FuelTypeService,
    public auth: AuthenticationService,
    public dialog: MatDialog,
    public configurationService: ConfigurationService
  ) { 
    super(service, auth, dialog, configurationService);
    this.params = {
      limit: 10,
    };

    this.filterOptions = [
      {
        label: 'Tipo combustible',
        property: 'type',
      },
    ];
    this.selectedOption = 'type';
  }

  protected validateExtras(result: FuelType) {
    result.updated_at = new Date().toDateString();
    return result;
  }
  protected getIdFrom(result: FuelType): number {
    return result.id;
  }
  protected search(id?: number): FuelType {
    return this.entities.find(e => e.id == id);
  }
  protected getRefDialog(dialogData: DialogData<FuelType, any>) {
    return this.dialog.open(FuelTypeDialogComponent, {
      width: '80%',
      data: dialogData,
      disableClose: true,
      panelClass: '',
    });
  }

  protected restore(): void {
    this.entity = {
      id: 0,
      type: '',
      created_at: new Date().toDateString(),
      updated_at: new Date().toDateString(),
    };
  }

  ngOnInit() {
    this.auth.checkPermission('/fueltypes')
    this.logged =
      typeof this.auth.currentUserValue === 'string' &&
      this.auth.currentUserValue !== '';
    this.user = JSON.parse(localStorage.getItem('user')) as User;
    this.restore();
    this.reload(false,this.params);
  }

  changeSelected() {
    this.params['type'] = null;
  }

}

@Component({
  selector: 'app-fuel-type-dialog',
  templateUrl: './fuel-type-dialog.component.html',
  styleUrls: ['./fuel-type.component.scss'],
})
export class FuelTypeDialogComponent
  extends DialogBase
  implements OnInit
{
  constructor(
    public dialogRef: MatDialogRef<FuelTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData<FuelType, null>
  ) {
    super(dialogRef);
  }

  get readonly() {
    return this.data.options.readonly;
  }
  ngOnInit(){
  }

}

