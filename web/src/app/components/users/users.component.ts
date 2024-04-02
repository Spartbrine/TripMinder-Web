import { Component, OnInit, Inject, NgModule } from '@angular/core';
import { DialogBase } from 'shared/helpers/dialog.base';
import { Catalog, FilterOption } from 'shared/helpers/catalog';
import { User, DialogData, FilterParams,  Profile as Pro  } from 'shared/interfaces';
import { AuthenticationService } from 'shared/services/authentication.service';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { Profile } from 'shared/constants';
import { ProfileService } from 'src/app/services/profile.service';
import { ConfigurationService } from 'src/app/services/configuration.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends Catalog<User, CreateUsersDialogComponent> implements OnInit {
  params: FilterParams<User>;
  filterOptions: FilterOption<User>[];
  selectedOption: keyof User;
  profiles: Pro[];


  constructor(
    public service: UserService,
    public auth: AuthenticationService,
    protected profileService: ProfileService,
    public dialog: MatDialog,
    public configurationService: ConfigurationService
  ) {
    super(service, auth, dialog, configurationService);

    this.params = {
      limit: 20
      /*orderBy: {
			field: 'fechaCreacion',
			order: 'asc'
			}*/
    };

    this.filterOptions = [
    {
      label: 'Perfil',
      property: 'profile'
    }, {
      label: 'Nombre',
      property: 'name'
    }, {
      label: 'Usuario',
      property: 'email'
    }];
    this.selectedOption = 'id';
    profileService.list().subscribe( response => this.profiles = response.data.data );
  }

  protected validateExtras(result: User) {
    result.updated_at = new Date().toDateString();
    return result;
  }

  protected getIdFrom(result: User): number {
    return result.id;
  }

  protected search(id?: number): User {
    return this.entities.find(e => e.id == id);
  }

  protected getRefDialog(dialogData: DialogData<User, any>) {
    return this.dialog.open(CreateUsersDialogComponent, {
      width: '80%',
      data: dialogData,
      disableClose: true,
      panelClass: ''
    });
  }

  getProfileName(key: number) {
    switch (key) {
      case Profile.ADMIN:
        return 'Administrador';
      case Profile.COBRATARIO:
        return 'Cobratario';
      case Profile.BODEGUERO:
        return 'Bodeguero';
      case Profile.CAPTURISTA:
        return 'Capturista';
      case Profile.VENDEDOR:
        return 'Vendedor';
      case Profile.VENDEDOR_COBRATARIO:
        return 'Vendedor/Cobratario';
    }
  }

  protected restore(): void {
    this.entity = {
      id: 0,
      status: 'Activo',
      created_at: new Date().toDateString(),
      password: '',
      email: '',
      name: '',
      updated_at: new Date().toDateString(),
      profile: 0
    };
  }

  ngOnInit() {
    this.auth.checkPermission('/users')
    this.logged = typeof this.auth.currentUserValue === 'string' &&
    this.auth.currentUserValue !== '';
    this.user = JSON.parse(localStorage.getItem('user')) as User;
    this.restore();
    this.reload(false,this.params);
  }

  changeSelected(){
    this.params['profile'] = null
    this.params['name'] = null
    this.params['email'] = null
  }
}

@Component({
  selector: 'app-create-users',
  templateUrl: './create-users-dialog.component.html',
  styleUrls: ['./users.component.scss']
})
export class CreateUsersDialogComponent extends DialogBase implements OnInit {

  type_pro = [Profile.ADMIN];

  profiles: Pro[];
  // responsibles: Responsible[];

  /** Si el perfil es de tipo Administrador Administrador General */
  validate = true;

  constructor(
    public dialogRef: MatDialogRef<UsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData<User, null>,
    private profile_serv: ProfileService,
  ) {
    super(dialogRef);
    
  }

  get readonly() {
    return this.data.options.readonly;
  }

  isAdmin(value) {
    console.log(value);
    this.validate = this.type_pro.includes(value);
  }


  
  ngOnInit() {
  
    this.profile_serv.list().
      subscribe( profile => this.profiles = profile.data.data );
  
    const { entity } = this.data;
    if ( this.data.options.update) {
      this.isAdmin(entity.profile);
    }
  }
}
