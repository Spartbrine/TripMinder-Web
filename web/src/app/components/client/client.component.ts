import { Component, OnInit, Inject, NgModule } from '@angular/core';
import { DialogBase } from 'shared/helpers/dialog.base';
import { Catalog, FilterOption } from 'shared/helpers/catalog';
import { User,Client,DialogData,FilterParams,} from 'shared/interfaces';
import { AuthenticationService } from 'shared/services/authentication.service';
import { MatDialogRef,MatDialog,MAT_DIALOG_DATA,} from '@angular/material/dialog';
import { ClientService } from 'src/app/services/client.service';
import { Profile } from 'shared/constants';
import { ConfigurationService } from 'src/app/services/configuration.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent 
extends Catalog<Client, ClientDialogComponent>
implements OnInit {
  params: FilterParams<Client>;
  filterOptions: FilterOption<Client>[];
  selectedOption: keyof Client | any;

  constructor(
    public service: ClientService,
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
        label: 'Cliente',
        property: 'name',
      },
    ];
    this.selectedOption = 'name';
  }

  protected validateExtras(result: Client) {
    result.updated_at = new Date().toDateString();
    return result;
  }
  protected getIdFrom(result: Client): number {
    return result.id;
  }
  protected search(id?: number): Client {
    return this.entities.find(e => e.id == id);
  }
  protected getRefDialog(dialogData: DialogData<Client, any>) {
    return this.dialog.open(ClientDialogComponent, {
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
      phone:'',
      email:'',
      website:'',
      rfc:'',
      created_at: new Date().toDateString(),
      updated_at: new Date().toDateString(),
    };
  }

  ngOnInit() {
    this.auth.checkPermission('/clients')
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
  selector: 'app-client-dialog',
  templateUrl: './client-dialog.component.html',
  styleUrls: ['./client.component.scss'],
})
export class ClientDialogComponent
  extends DialogBase
  implements OnInit
{
  constructor(
    public dialogRef: MatDialogRef<ClientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData<Client, null>
  ) {
    super(dialogRef);
  }

  get readonly() {
    return this.data.options.readonly;
  }
  ngOnInit(){
  }

}

