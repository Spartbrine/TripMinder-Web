import { Component, OnInit, Inject, NgModule } from '@angular/core';
import { DialogBase } from 'shared/helpers/dialog.base';
import { Catalog, FilterOption } from 'shared/helpers/catalog';
import { User,Responsible,DialogData,FilterParams,} from 'shared/interfaces';
import { AuthenticationService } from 'shared/services/authentication.service';
import { MatDialogRef,MatDialog,MAT_DIALOG_DATA,} from '@angular/material/dialog';
import { ResponsibleService } from 'src/app/services/responsible.service';
import { Profile } from 'shared/constants';
import { ConfigurationService } from 'src/app/services/configuration.service';

@Component({
  selector: 'app-responsible-type',
  templateUrl: './responsible.component.html',
  styleUrls: ['./responsible.component.scss']
})
export class ResponsibleComponent 
extends Catalog<Responsible, ResponsibleDialogComponent>
implements OnInit {
  params: FilterParams<Responsible>;
  filterOptions: FilterOption<Responsible>[];
  selectedOption: keyof Responsible | any;

  constructor(
    public service: ResponsibleService,
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
        label: 'Responsable',
        property: 'name',
      },
    ];
    this.selectedOption = 'name';
  }

  protected validateExtras(result: Responsible) {
    result.updated_at = new Date().toDateString();
    return result;
  }
  protected getIdFrom(result: Responsible): number {
    return result.id;
  }
  protected search(id?: number): Responsible {
    return this.entities.find(e => e.id == id);
  }
  protected getRefDialog(dialogData: DialogData<Responsible, any>) {
    return this.dialog.open(ResponsibleDialogComponent, {
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
      license_number:'',
      phone:'',
      address:'',
      photo:'',
      created_at: new Date().toDateString(),
      updated_at: new Date().toDateString(),
    };
  }

  ngOnInit() {
    this.auth.checkPermission('/responsibles')
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
  selector: 'app-responsible-dialog',
  templateUrl: './responsible-dialog.component.html',
  styleUrls: ['./responsible.component.scss'],
})
export class ResponsibleDialogComponent
  extends DialogBase
  implements OnInit
{
  constructor(
    public dialogRef: MatDialogRef<ResponsibleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData<Responsible, null>
  ) {
    super(dialogRef);
  }

  get readonly() {
    return this.data.options.readonly;
  }
  ngOnInit(){
  }

}

