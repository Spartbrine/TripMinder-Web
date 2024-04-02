import { Component, OnInit, Inject, NgModule } from '@angular/core';
import { DialogBase } from 'shared/helpers/dialog.base';
import { Catalog, FilterOption } from 'shared/helpers/catalog';
import { User,TransportType,DialogData,FilterParams,} from 'shared/interfaces';
import { AuthenticationService } from 'shared/services/authentication.service';
import { MatDialogRef,MatDialog,MAT_DIALOG_DATA,} from '@angular/material/dialog';
import { TransportTypeService } from 'src/app/services/transport-type.service';
import { Profile } from 'shared/constants';
import { ConfigurationService } from 'src/app/services/configuration.service';

@Component({
  selector: 'app-transport-type',
  templateUrl: './transport-type.component.html',
  styleUrls: ['./transport-type.component.scss']
})
export class TransportTypeComponent 
extends Catalog<TransportType, TransportTypeDialogComponent>
implements OnInit {
  params: FilterParams<TransportType>;
  filterOptions: FilterOption<TransportType>[];
  selectedOption: keyof TransportType | any;

  constructor(
    public service: TransportTypeService,
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
        label: 'Tipo Transporte',
        property: 'type',
      },
    ];
    this.selectedOption = 'type';
  }

  protected validateExtras(result: TransportType) {
    result.updated_at = new Date().toDateString();
    return result;
  }
  protected getIdFrom(result: TransportType): number {
    return result.id;
  }
  protected search(id?: number): TransportType {
    return this.entities.find(e => e.id == id);
  }
  protected getRefDialog(dialogData: DialogData<TransportType, any>) {
    return this.dialog.open(TransportTypeDialogComponent, {
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
    this.auth.checkPermission('/transporttypes')
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
  selector: 'app-transport-type-dialog',
  templateUrl: './transport-type-dialog.component.html',
  styleUrls: ['./transport-type.component.scss'],
})
export class TransportTypeDialogComponent
  extends DialogBase
  implements OnInit
{
  constructor(
    public dialogRef: MatDialogRef<TransportTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData<TransportType, null>
  ) {
    super(dialogRef);
  }

  get readonly() {
    return this.data.options.readonly;
  }
  ngOnInit(){
  }

}

