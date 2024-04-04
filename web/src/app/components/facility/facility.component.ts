import { Component, OnInit, Inject, NgModule } from '@angular/core';

import { DialogBase } from 'shared/helpers/dialog.base';
import { Catalog, FilterOption } from 'shared/helpers/catalog';
import { User,Facility,DialogData,FilterParams,} from 'shared/interfaces';
import { AuthenticationService } from 'shared/services/authentication.service';
import { MatDialogRef,MatDialog,MAT_DIALOG_DATA,} from '@angular/material/dialog';
import { FacilityService } from 'src/app/services/facility.service';
import { Profile } from 'shared/constants';
import { ConfigurationService } from 'src/app/services/configuration.service';

@Component({
  selector: 'app-facility',
  templateUrl: './facility.component.html',
  styleUrls: ['./facility.component.scss']
})
export class FacilityComponent 
extends Catalog<Facility, FacilityDialogComponent>
implements OnInit {

  params: FilterParams<Facility>;
  filterOptions: FilterOption<Facility>[];
  selectedOption: keyof Facility | any;

  constructor(
    public service: FacilityService,
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
        label: 'Instalacion',
        property: 'name',
      },
    ];
    this.selectedOption = 'name';
  }

  protected validateExtras(result: Facility) {
    result.updated_at = new Date().toDateString();
    return result;
  }
  protected getIdFrom(result: Facility): number {
    return result.id;
  }
  protected search(id?: number): Facility {
    return this.entities.find(e => e.id == id);
  }
  protected getRefDialog(dialogData: DialogData<Facility, any>) {
    return this.dialog.open(FacilityDialogComponent, {
      width: '80%',
      data: dialogData,
      disableClose: true,
      panelClass: '',
    });
  }

  protected restore(): void {
    this.entity = {
      id: 0,
      name: '',
      phone: '',
      longitude: '',
      latitude: '',
      locality: '',
      postal_code: '',
      address: '',
      created_at: new Date().toDateString(),
      updated_at: new Date().toDateString(),
    };
  }

  ngOnInit() {
    this.auth.checkPermission('/facilities')
    this.logged =
      typeof this.auth.currentUserValue === 'string' &&
      this.auth.currentUserValue !== '';
    this.user = JSON.parse(localStorage.getItem('user')) as User;
    this.restore();
    this.reload(false,this.params);
  }

  changeSelected() {
    this.params['name'] = null;
    this.params['phone'] = null
    this.params['longitude'] = null
    this.params['latitude'] = null
    this.params['locality'] = null
    this.params['postal_code'] = null
    this.params['address'] = null
  }

}

@Component({
  selector: 'app-facility-dialog',
  templateUrl: './facility-dialog.component.html',
  styleUrls: ['./facility.component.scss'],
})
export class FacilityDialogComponent
  extends DialogBase
  implements OnInit
{
  constructor(
    public dialogRef: MatDialogRef<FacilityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData<Facility, null>
  ) {
    super(dialogRef);
  }

  get readonly() {
    return this.data.options.readonly;
  }
  ngOnInit(){
  }

}