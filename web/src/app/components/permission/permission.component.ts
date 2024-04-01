import { Component, OnInit } from '@angular/core';
import { Confirm, Toast } from 'shared/alerts';
import { Configuration, DataUserElement, GrouperElements, OptionsForUserElement, Profile, ProfileElement, User, UserElement } from 'shared/interfaces';
import { AuthenticationService } from 'shared/services/authentication.service';
import { UserService } from 'src/app/services';
import { ProfileService } from 'src/app/services/profile.service';
import { SecurityService } from 'src/app/services/security.service';
import { ConfigurationService } from 'src/app/services/configuration.service';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {
  users: User[];
  profiles: Profile[];
  user: User;
  grouperElements: GrouperElements[];
  otherGrouperElements: GrouperElements[] = [];
  id_grouperElements: number[] = [];
  id_otherGrouperElements: number[] = [];
  userElements: UserElement[];
  profileElements: ProfileElement[];
  current_user: number;
  current_profile: number;
  viewOtherPermissons: boolean = false;
  viewProfilePermissons: boolean = true;
  disabled: boolean = true;
  configuration: Configuration
  systemColor: '#FFFFF'
  isChecked: false

  constructor(
    public service: SecurityService,
    public userService: UserService,
    public profileService: ProfileService,
    public auth: AuthenticationService,
    public configurationService: ConfigurationService

  ) { 
    this.user = {
      id: 0,
      name: '',
      email: '',
      password: '',
      status: '',
      profile: 0,
      created_at: '',
      updated_at: ''
    }
    this.configuration = configurationService.configurationObject
  }

  ngOnInit() {
    this.auth.checkPermission('/permissions')
    this.profileService.list().subscribe(response => this.profiles = response.data.data)
    this.userService.list().subscribe(response => {
      this.users = response.data.data.slice(1)
      this.current_user = 31;
      this.loadPermissions()
    })


  }

  searchUser(text: string) {
    if (text.length == 0) {
      this.userService
        .list()
        .subscribe(response => (this.users = response.data.data));
    } else {
      this.userService
        .search(text)
        .subscribe(response => (this.users = response.data.data));
    }
  }

  switchOtherPermissions() {
    this.viewOtherPermissons = !this.viewOtherPermissons
  }

  switchProfilePermissions() {
    this.viewProfilePermissons = !this.viewProfilePermissons
  }



  loadPermissions() {
    this.grouperElements = [];
    this.userElements = [];
    this.disabled = true

    this.userService.single(this.current_user).subscribe(data => {
      this.user = data
      this.current_profile = this.user.profile
      this.service.getElementsByGrouper(true).subscribe(response => {
        this.grouperElements = response.data
        this.service.getUserElements(this.user.id).subscribe(response => {
          this.userElements = response.data
          this.comparePermissions();
          //this.loadOtherPermissions()
        })
      })
      // this.service.getProfileElementsByGrouper(this.user.o_profile.id, true).subscribe(response => {
      //   this.grouperElements = response.data
      //   this.service.getUserElements(this.user.id).subscribe(response => {
      //     this.userElements = response.data
      //     this.comparePermissions();
      //     this.loadOtherPermissions()
      //   })
      // })
    })
  }

  // loadOtherPermissions() {
  //   this.otherGrouperElements = []
  //   this.id_otherGrouperElements = []
  //   this.service.getElementsByGrouper(true).subscribe(response => {
  //     this.grouperElements.forEach(othergrouperelement => {
  //       othergrouperelement.elements.forEach(element => {
  //         this.id_otherGrouperElements.push(element.id)
  //       })
  //     })

  //     response.data.forEach(grouperelement => {

  //       let newGrouperElement: GrouperElements = {
  //         id: grouperelement.id,
  //         name: grouperelement.name,
  //         icon: grouperelement.icon,
  //         elements: [],
  //       }

  //       grouperelement.elements.forEach(element => {
  //         !this.id_otherGrouperElements.includes(element.id) ? newGrouperElement.elements.push(element) : {}
  //       })

  //       if (newGrouperElement.elements.length > 0) {
  //         this.otherGrouperElements.push(newGrouperElement);
  //       }


  //     })

  //     this.otherGrouperElements.forEach(grouperElement => {
  //       grouperElement.elements.forEach(element => {
  //         element.assigned = this.userElements.some(userElement => userElement.id_element == element.id)

  //       })
  //     })


  //   })
  // }

  comparePermissions() {
    this.grouperElements.forEach(grouperElement => {
      grouperElement.elements.forEach(element => {
        element.assigned = this.userElements.some(userElement => userElement.id_element == element.id)
      })
    })
  }

  loadProfileElements() {
    this.profileElements = [];
    this.service.getProfileElements(this.current_profile).subscribe(response => {
      this.profileElements = response.data
      this.grouperElements.forEach(grouperElement => {
        grouperElement.elements.forEach(element => {
          element.assigned = this.profileElements.some(profileElement => profileElement.id_element == element.id)
        })
      })
    })
  }


  savePermissions() {
    let userElementsAdd: UserElement[] = []
    let userElementsDelete: UserElement[] = []

    this.grouperElements.forEach(grouperElement => {
      grouperElement.elements.forEach(element => {
        const userElement: UserElement = {
          id: 0,
          id_user: this.user.id,
          id_element: element.id
        }

        element.assigned ? userElementsAdd.push(userElement) : userElementsDelete.push(userElement)
      })
    })

    // this.otherGrouperElements.forEach(grouperElement => {
    //   grouperElement.elements.forEach(element => {
    //     const userElement: UserElement = {
    //       id: 0,
    //       id_user: this.user.id,
    //       id_element: element.id
    //     }

    //     element.assigned ? userElementsAdd.push(userElement) : userElementsDelete.push(userElement)
    //   })
    // })

    const dataAdd: DataUserElement = {
      data: userElementsAdd
    }

    const dataDelete: DataUserElement = {
      data: userElementsDelete
    }

    const optionsUserElement: OptionsForUserElement = {
      body: dataDelete
    }

    this.service.storeUserElement(dataAdd).subscribe()
    this.service.deleteUserElement(optionsUserElement).subscribe()
    Toast.fire({
      icon: 'success',
      title: 'Permisos guardados',
    });
    if(this.current_profile != this.user.profile){
      this.user.profile = this.current_profile
      this.userService.updateOnlyProfile(this.current_user, this.user).subscribe();
    }
    this.loadPermissions();

  }

  showAlert() {
    Confirm.fire({
      title: '¿Esta seguro que desea guardar los permisos con el perfil seleccionado?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then(result => {
      if (result.value) {
        this.savePermissions()
      }
    })

  }

  enableProfile(){
    this.disabled = false
  }



}
