import { Component, OnInit, Inject } from '@angular/core';
import { DialogBase } from 'shared/helpers/dialog.base';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DialogData, Profile, User, FilterParams } from 'shared/interfaces';
import { Catalog, FilterOption } from 'shared/helpers/catalog';
import { AuthenticationService } from 'shared/services/authentication.service';
import { ProfileService } from 'src/app/services/profile.service';
import { ConfigurationService } from 'src/app/services/configuration.service';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss']
})
export class ProfilesComponent extends Catalog<Profile, CreateProfileDialogComponent> implements OnInit {
  params: FilterParams<Profile>;
  filterOptions: FilterOption<Profile>[];
  selectedOption: keyof Profile | undefined;
  constructor(
    public service: ProfileService,
    public auth: AuthenticationService,
    public dialog: MatDialog,
    public configurationService: ConfigurationService
  ) {
    super(service, auth, dialog, null, null, configurationService);
    this.params = {
      limit: 25,
      orderBy: {
        field: 'name',
        order: 'asc'
      }
    };
  }

  ngOnInit() {
    this.reload(false,this.params);
    this.logged =
      typeof this.auth.currentUserValue === 'string' &&
      this.auth.currentUserValue !== '';
    this.user = JSON.parse(localStorage.getItem('user')) as User;
  }
  protected validateExtras(result: Profile) {
    result.updated_at = new Date();
    return result;
  }
  
  protected getIdFrom(result: Profile): number {
    return result.id;
  }
  protected search(id?: number): Profile {
    return this.entities.find(c => c.id == id);
  }
  protected getRefDialog(dialogData: DialogData<Profile, any>) {
    return this.dialog.open(CreateProfileDialogComponent,{
      width: '80%',
      data: dialogData,
      disableClose: true,
      panelClass: ''
    }
    );
  }
  protected restore(): void {
    this.entity = {
      id: 0,
      name: '',
      // control:0,
      // permissions: '',
      created_at: new Date(),
      updated_at: new Date()

    };
  }
}

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile-dialog.component.html',
  styleUrls: ['./profiles.component.scss']
})
export class CreateProfileDialogComponent extends DialogBase {
  constructor(
    public dialogRef: MatDialogRef<ProfilesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData<Profile, null>
  ) {
    super(dialogRef);
  }

  get readonly() {
    return this.data.options.readonly;
  }
}
