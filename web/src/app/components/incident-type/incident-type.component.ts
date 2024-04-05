import { Component, OnInit, Inject, NgModule } from '@angular/core';
import { DialogBase } from 'shared/helpers/dialog.base';
import { Catalog, FilterOption } from 'shared/helpers/catalog';
import { User,IncidentType,DialogData,FilterParams,} from 'shared/interfaces';
import { AuthenticationService } from 'shared/services/authentication.service';
import { MatDialogRef,MatDialog,MAT_DIALOG_DATA,} from '@angular/material/dialog';
import { IncidentTypeService } from 'src/app/services/incident-type.service';
import { Profile } from 'shared/constants';
import { ConfigurationService } from 'src/app/services/configuration.service';

@Component({
  selector: 'app-incident-type',
  templateUrl: './incident-type.component.html',
  styleUrls: ['./incident-type.component.scss']
})
export class IncidentTypeComponent 
extends Catalog<IncidentType, IncidentTypeDialogComponent>
implements OnInit {
  params: FilterParams<IncidentType>;
  filterOptions: FilterOption<IncidentType>[];
  selectedOption: keyof IncidentType | any;

  constructor(
    public service: IncidentTypeService,
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
        label: 'Tipo incidente',
        property: 'name',
      },
    ];
    this.selectedOption = 'name';
  }

  protected validateExtras(result: IncidentType) {
    result.updated_at = new Date().toDateString();
    return result;
  }
  protected getIdFrom(result: IncidentType): number {
    return result.id;
  }
  protected search(id?: number): IncidentType {
    return this.entities.find(e => e.id == id);
  }
  protected getRefDialog(dialogData: DialogData<IncidentType, any>) {
    return this.dialog.open(IncidentTypeDialogComponent, {
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
      created_at: new Date().toDateString(),
      updated_at: new Date().toDateString(),
    };
  }

  ngOnInit() {
    this.auth.checkPermission('/incidenttypes')
    this.logged =
      typeof this.auth.currentUserValue === 'string' &&
      this.auth.currentUserValue !== '';
    this.user = JSON.parse(localStorage.getItem('user')) as User;
    this.restore();
    this.reload(false,this.params);
  }

  changeSelected() {
    this.params['name'] = null;
  }

}

@Component({
  selector: 'app-incident-type-dialog',
  templateUrl: './incident-type-dialog.component.html',
  styleUrls: ['./incident-type.component.scss'],
})
export class IncidentTypeDialogComponent
  extends DialogBase
  implements OnInit
{
  constructor(
    public dialogRef: MatDialogRef<IncidentTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData<IncidentType, null>
  ) {
    super(dialogRef);
  }

  get readonly() {
    return this.data.options.readonly;
  }
  ngOnInit(){
  }

}

