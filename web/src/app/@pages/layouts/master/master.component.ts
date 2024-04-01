import { Component, OnInit, ViewEncapsulation, ViewChild, AfterViewInit } from '@angular/core';
import { RootLayout } from '..';
import { Configuration, GrouperElements, MenuLink, User } from 'shared/interfaces';
import { AuthenticationService } from 'shared/services/authentication.service';
import { isProfile, Profile } from 'shared/constants';
import { QuickviewComponent } from '../../components/quickview/quickview.component';
import { randomIntId } from 'shared/utils/generator';
import { BehaviorSubject } from 'rxjs';
import { pagesToggleService } from '../../services/toggler.service';
import { Router } from '@angular/router';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { BranchService } from 'src/app/services/branch.service';
import { AgentService } from 'src/app/services/agent.service';
// icon pages
// http://pages.revox.io/dashboard/cheatsheet/
// https://material.io/resources/icons/?style=baseline

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MasterComponent extends RootLayout implements OnInit, AfterViewInit {
  title = 'master works!';
  user: User;
  subMenuLinks: MenuLink[]
  grouperElements: GrouperElements[]
  menuLinks: MenuLink[] = []
  // = [
  //   {
  //     label: 'Dashboard',
  //     iconType: 'fa',
  //     iconName: 'chart-bar',
  //     routerLink: '/dashboard'
  //   },
  //   {
  //     label: 'Catálogos',
  //     iconType: 'material',
  //     iconName: 'class',
  //     toggle: 'close',
  //     submenu: [
  //       {
  //         label: 'Clientes',
  //         iconType: 'pg',
  //         iconName: 'C',
  //         routerLink: '/clients'
  //       },
  //       {
  //         label: 'Productos',
  //         iconType: 'pg',
  //         iconName: 'P',
  //         routerLink: '/products'
  //       },
  //       {
  //         label: 'Entradas',
  //         iconType: 'pg',
  //         iconName: 'E',
  //         routerLink: '/stocks'
  //       },
  //       {
  //         label: 'Inventario',
  //         iconType: 'pg',
  //         iconName: 'I',
  //         routerLink: '/inventories'
  //       },
  //       {
  //         label: 'Agentes',
  //         iconType: 'pg',
  //         iconName: 'A',
  //         routerLink: '/agents'
  //       },
  //       {
  //         label: 'Categorías',
  //         iconType: 'pg',
  //         iconName: 'C',
  //         routerLink: '/categories'
  //       },
  //       {
  //         label: 'Sucursales',
  //         iconType: 'pg',
  //         iconName: 'S',
  //         routerLink: '/branches'
  //       }


  //     ]
  //   },
  //   {
  //     label: 'Ventas',
  //     iconType: 'pg',
  //     iconName: 'keyboard',
  //     toggle: 'close',
  //     submenu: [
  //       {
  //         label: 'Punto de Venta',
  //         iconType: 'pg',
  //         iconName: 'P',
  //         routerLink: '/sales'
  //       },
  //       {
  //         label: 'Canceladas',
  //         iconType: 'pg',
  //         iconName: 'C',
  //         routerLink: '/salecanceleds'
  //       },
  //       {
  //         label: 'Unificación de Ventas',
  //         iconType: 'pg',
  //         iconName: 'U',
  //         routerLink: '/saleunifications'
  //       },
  //       {
  //         label: 'Productos Devueltos',
  //         iconType: 'pg',
  //         iconName: 'P',
  //         routerLink: '/returnedproducts'
  //       },
  //     ]
  //   },
  //   {
  //     label: 'Cobros',
  //     iconType: 'pg',
  //     iconName: 'inbox_all',
  //     toggle: 'close',
  //     submenu: [
  //       {
  //         label: 'Pagos',
  //         iconType: 'pg',
  //         iconName: 'P',
  //         routerLink: '/payments'
  //       },
  //       {
  //         label: 'Pagos del Dia',
  //         iconType: 'pg',
  //         iconName: 'P',
  //         routerLink: '/paymentsbydate'
  //       },
  //       {
  //         label: 'Pagos Masivos',
  //         iconType: 'pg',
  //         iconName: 'P',
  //         routerLink: '/massivepayments'
  //       },
  //       {
  //         label: 'Cambio Cobratarios',
  //         iconType: 'pg',
  //         iconName: 'C',
  //         routerLink: '/massivecollectors'
  //       },
  //     ]
  //   },
  //   {
  //     label: 'Reportes',
  //     iconType: 'pg',
  //     iconName: 'clipboard',
  //     toggle: 'close',
  //     submenu: [
  //       {
  //         label: 'Ventas de Agente',
  //         iconType: 'pg',
  //         iconName: 'V',
  //         routerLink: '/reportsales'
  //       },
  //       {
  //         label: 'Activos',
  //         iconType: 'pg',
  //         iconName: 'A',
  //         routerLink: '/reportactivesales'
  //       },
  //       {
  //         label: 'Detallado',
  //         iconType: 'pg',
  //         iconName: 'D',
  //         routerLink: '/reportdetailedsales'
  //       },
  //       {
  //         label: 'Ventas',
  //         iconType: 'pg',
  //         iconName: 'V',
  //         routerLink: '/reportreportedsales'
  //       },
  //       {
  //         label: 'Cobranza',
  //         iconType: 'pg',
  //         iconName: 'C',
  //         routerLink: '/reportcollections'
  //       },
  //       {
  //         label: 'Historial Cliente',
  //         iconType: 'pg',
  //         iconName: 'H',
  //         routerLink: '/historyclient'
  //       },
  //       {
  //         label: 'Clientes Morosos',
  //         iconType: 'pg',
  //         iconName: 'C',
  //         routerLink: '/reportclients'
  //       },
  //     ]
  //   },
  //   {
  //     label: 'Cobranza',
  //     iconType: 'pg',
  //     iconName: '$',
  //     toggle: 'close',
  //     submenu: [
  //       {
  //         label: 'Asignación',
  //         iconType: 'pg',
  //         iconName: 'send',
  //         routerLink: '/assignamentcollections'
  //       },
  //     ]
  //   },
  //   {
  //     label: 'Ajustes',
  //     iconType: 'pg',
  //     iconName: 'settings',
  //     toggle: 'close',
  //     submenu: [
  //       {
  //         label: 'Usuarios',
  //         iconType: 'pg',
  //         iconName: 'users',
  //         routerLink: '/users'
  //       },
  //     ]
  //   },


  // ];
  auth: AuthenticationService;
  configuration: Configuration

  message = new BehaviorSubject(null);
  showNotification = false;
  @ViewChild('quickview') quickview: QuickviewComponent;

  constructor(
    public configurationService: ConfigurationService,
    private $toggler: pagesToggleService,
    private $router: Router,
    private agentService: AgentService,
    private branchService: BranchService
  ) {
    super($toggler, $router);
    this.configuration = configurationService.configurationObject
    this.grouperElements = JSON.parse(localStorage.getItem('grouperElements'));
    if (this.grouperElements) {
      this.grouperElements.forEach(grouperElement => {

        let SubMenuLinks: MenuLink[] = []

        grouperElement.elements.forEach(element => {
          const SubMenuLink: MenuLink = {
            label: element.name,
            iconType: 'pg',
            iconName: element.icon,
            routerLink: element.url
          }

          SubMenuLinks.push(SubMenuLink);
        })

        const menuLink: MenuLink = {
          label: grouperElement.name,
          iconType: grouperElement.icon == 'class' || grouperElement.icon == 'phonelink_setup' ? "material" : "pg",
          iconName: grouperElement.icon,
          toggle: 'close',
          submenu: SubMenuLinks
        }

        this.menuLinks.push(menuLink);
      });
    }

  }
  ngOnInit() {
    localStorage.setItem('sign', 'commercial');
    this.user = JSON.parse(localStorage.getItem('user'));
    if (!this.user)
      this.$router.navigate(['/login']);

  }

  permissionAE() {
    return (isProfile(this.user, Profile.ADMIN));
  }
  ngAfterViewInit() {
    if (this.user) {
      console.log('Found a quickview');
    } else {
      console.error(`Didn't find any quickview or any user`);
      this.$router.navigate(['/login']);
    }
  }

  onClickNotification($event) {
    $event.preventDefault();

    this.toggler.toggleQuickView();
  }

  logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    localStorage.removeItem('sign');
    localStorage.removeItem('grouperElements');
    this.agentService.deleteEntityOnStorage()
    this.branchService.deleteEntityOnStorage()
    location.reload();
  }

  get isAdmin() {
    return isProfile(this.user, Profile.ADMIN);
  }
}