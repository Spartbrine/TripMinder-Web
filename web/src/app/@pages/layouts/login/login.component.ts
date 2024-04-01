import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'shared/services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Authable } from 'shared/helpers/authable';
import { SecurityService } from 'src/app/services/security.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { Configuration } from 'shared/interfaces';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent extends Authable implements OnInit {
  @ViewChild('root') root;
  title = 'login works!';
  returnUrl: string;
  email: string;
  password: string;
  type: string;
  loading = false;
  visibility: string;
  error = false;
  configuration: Configuration;
  btn_login_color: string
  constructor(
    private auth: AuthenticationService,
    private route: ActivatedRoute,
    public router: Router,
    public securityService: SecurityService,
    public configurationService: ConfigurationService,
    private titleService: Title
  ) {
    super(auth);
    if (!localStorage.getItem('configuration')) {
      configurationService.getConfiguration().subscribe(response => {
        this.configuration = response.data
        localStorage.setItem('configuration', JSON.stringify(response.data))
      })
    }
    else {
      this.configuration = configurationService.configurationObject
    }

    titleService.setTitle(this.configuration.name + ' - Login');

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
    this.type = 'password';
    this.visibility = 'visibility';




  }

  ngOnInit() {
    const token = this.auth.currentUserValue;
    const user = this.auth.currentUser;
    if (token) {
      console.log(`I'm logged, token: ${token}`);
      this.router.navigate([this.returnUrl]);
    }
  }

  showPassword(event: Event) {

    if (this.type === 'password') {
      this.type = 'text';
      this.visibility = 'visibility_off';
    }
    else {
      this.type = 'password';
      this.visibility = 'visibility';
    }
  }

  loginUser() {
    this.loading = true;
    if (this.email && this.password) {
      this.auth.login(this.email, this.password).subscribe(
        data => {
          this.logged = true;
          this.loading = false;
          let user = JSON.parse(localStorage.getItem('user'));
          localStorage.setItem('configuration', JSON.stringify(data.configuration))


          this.securityService.getUserElementsByGrouper(user.id, true, data.accessToken).subscribe(response => {
            localStorage.setItem('grouperElements', JSON.stringify(response.data))
            this.router.parseUrl(this.returnUrl);
            location.reload();
          })


        },
        error => {
          this.loading = false;
          console.error(error);
          this.error = true;
        }
      );
    }
  }

}
