import { Component, OnInit } from '@angular/core';
import { Toast } from 'shared/alerts';
import { isProfile, Profile } from 'shared/constants';
import { Configuration, User } from 'shared/interfaces';
import { AuthenticationService } from 'shared/services/authentication.service';
import { UserService } from 'src/app/services';
import { ConfigurationService } from 'src/app/services/configuration.service';



@Component({
   selector: 'app-user-account',
   templateUrl: './user-account.component.html'
})

export class UserAccountComponent implements OnInit {
   public user: User;
   public currentPassword: string;
   public newPassword: string;
   public confirmPassword: string;


   /** Validate passwords */
   public flagCurrentPass: boolean;
   public flagConfirmPass: boolean;
   public isSamePassword: boolean;
   configuration: Configuration



   constructor(
      private authentication: AuthenticationService,
      private userService: UserService,
      public configurationService: ConfigurationService

   ) {
      this.configuration = this.configurationService.configurationObject
   }


   checkCurrentPass() {
      if (this.user.password === this.currentPassword) {
         console.log('yes');
         this.flagCurrentPass = true;
         return;
      }
      this.flagCurrentPass = false;
   }

   checkConfirmPass() {
      if (this.user.password === this.newPassword || this.user.password === this.confirmPassword) {
         this.isSamePassword = true;
         return;
      }

      this.isSamePassword = false;

      if (this.newPassword === this.confirmPassword) {
         console.log('Coincidence');
         this.flagConfirmPass = true;
         return;
      }
      this.flagConfirmPass = false;
   }

   changePassword() {
      if (this.currentPassword && this.newPassword && this.confirmPassword) {
         const userModified = {...this.user};
         userModified.password = this.newPassword;

         this.userService.update(userModified.id, userModified).subscribe(
            response => {
               Toast.fire({
                  icon: 'success',
                  title: 'La contraseña ha sido actualizada',
                  text: 'Se necesita iniciar sessión de nuevo'
               });
               this.authentication.logout();
               location.reload();
            },
            error => {
               Toast.fire({
                  icon: 'error',
                  title: 'Error al actualizar contraseña'
               });
            }
         );
      }
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

   ngOnInit() {
      this.user = JSON.parse(localStorage.getItem('user'));
   }
}
