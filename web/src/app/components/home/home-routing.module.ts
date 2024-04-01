import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { NotFoundComponent } from '../not-found/not-found.component';
import { UsersComponent } from '../users/users.component';

import { ProfilesComponent } from '../profiles/profiles.component';
import { JwtInterceptor } from 'shared/helpers/jwt.interceptor';
import { ProfileGuard } from 'shared/helpers/profile.guard';
import { Profile } from 'shared/constants';
import { UserAccountComponent } from '../user-account/user-account.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [JwtInterceptor],
    children: [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      /** routerlinks Dashboard */
      {
        path: 'profiles', component: ProfilesComponent,
        // canActivate: [ProfileGuard],
        // data: { type_profile: [Profile.ADMIN] }},
      },
      /** routerlinks Other */
      { path: 'account', component: UserAccountComponent },
      /** routerlinks Support */
      {
        path: 'users',
        //  canActivate: [ProfileGuard],
        //  data: {type_profile: [Profile.ADMIN]},
        loadChildren: () => import('../users/users.module').then(m => m.UsersModule)
      },
      //    {
      //      path: 'localities',
      // //    //  canActivate: [ProfileGuard],
      // //    //  data: {type_profile: [Profile.ADMIN]},
      //      loadChildren: () => import('../locality/locality.module').then(m => m.LocalityModule)
      // },
      {
        path: 'clients',
        //  canActivate: [ProfileGuard],
        //  data: {type_profile: [Profile.ADMIN]},
        loadChildren: () => import('../client/client.module').then(m => m.ClientModule)
      },
      {
        path: 'agents',
        loadChildren: () => import('../agent/agent.module').then(m => m.AgentModule)
      },
      {
        path: 'products',
        //  canActivate: [ProfileGuard],
        //  data: {type_profile: [Profile.ADMIN]},
        loadChildren: () => import('../product/product.module').then(m => m.ProductModule)
      },
      {
        path: 'returnedproducts',
        //  canActivate: [ProfileGuard],
        //  data: {type_profile: [Profile.ADMIN]},
        loadChildren: () => import('../returnedproducts/returnedproducts.module').then(m => m.ReturnedproductsModule)
      },
      {
        path: 'stocks',
        //  canActivate: [ProfileGuard],
        //  data: {type_profile: [Profile.ADMIN]},
        loadChildren: () => import('../stock/stock.module').then(m => m.StockModule)
      },
      {
        path: 'payments',
        //  canActivate: [ProfileGuard],
        //  data: {type_profile: [Profile.ADMIN]},
        loadChildren: () => import('../payment/payment.module').then(m => m.PaymentModule)
      },
      {
        path: 'sales',
        //  canActivate: [ProfileGuard],
        //  data: {type_profile: [Profile.ADMIN]},
        loadChildren: () => import('../sale/sale.module').then(m => m.SaleModule)
      },
      {
        path: 'point-of-sale',
        loadChildren: () => import('../point-of-sale/point-of-sale.module').then(m => m.PointOfSaleModule)
      },
      {
        path: 'detail-of-sale/:id',
        loadChildren: () => import('../detail-of-sale/detail-of-sale.module').then(m => m.DetailOfSaleModule)
      },
      {
        path: 'salecanceleds',
        loadChildren: () => import('../salecanceled/salecanceled.module').then(m => m.SalecanceledModule)
      },
      {
        path: 'saleunifications',
        loadChildren: () => import('../unificationsales/unificationsales.module').then(m => m.UnificationsalesModule)
      },
      {
        path: 'reportsales',
        loadChildren: () => import('../reportsales/reportsales.module').then(m => m.ReportsalesModule)
      },
      {
        path: 'reportactivesales',
        loadChildren: () => import('../reportactivesales/reportactivesales.module').then(m => m.ReportactivesalesModule)
      },
      {
        path: 'reportdetailedsales',
        loadChildren: () => import('../reportdetailedsales/reportdetailedsales.module').then(m => m.ReportdetailedsalesModule)
      },
      {
        path: 'reportreportedsales',
        loadChildren: () => import('../reportreportedsales/reportreportedsales.module').then(m => m.ReportreportedsalesModule)
      },
      {
        path: 'reportcollections',
        loadChildren: () => import('../reportcollections/reportcollections.module').then(m => m.ReportcollectionsModule)
      },
      {
        path: 'reportcollectionslocality',
        loadChildren: () => import('../reportcollectlocality/reportcollectlocality.module').then(m => m.ReportcollectlocalityModule)
      },
      {
        path: 'reportclients',
        loadChildren: () => import('../reportclients/reportclients.module').then(m => m.ReportclientsModule)
      },
      {
        path: 'reportdiscounts',
        loadChildren: () => import('../reportdiscounts/reportdiscounts.module').then(m => m.ReportdiscountsModule)
      },
      {
        path: 'inventories',
        loadChildren: () => import('../inventory/inventory.module').then(m => m.InventoryModule)
      },
      {
        path: 'categories',
        loadChildren: () => import('../category/category.module').then(m => m.CategoryModule)
      },
      {
        path: 'massivepayments',
        loadChildren: () => import('../massivepayments/massivepayments.module').then(m => m.MassivepaymentsModule)
      },
      {
        path: 'historyclient',
        loadChildren: () => import('../historyclient/historyclient.module').then(m => m.HistoryclientModule)
      },
      {
        path: 'massivecollectors',
        loadChildren: () => import('../massivecollectors/massivecollectors.module').then(m => m.MassivecollectorsModule)
      },
      {
        path: 'branches',
        loadChildren: () => import('../branch/branch.module').then(m => m.BranchModule)
      },
      {
        path: 'suppliers',
        loadChildren: () => import('../supplier/supplier.module').then(m => m.SupplierModule)
      },
      {
        path: 'brands',
        loadChildren: () => import('../brand/brand.module').then(m => m.BrandModule)
      },
      {
        path: 'units',
        loadChildren: () => import('../unit/unit.module').then(m => m.UnitModule)
      },
      {
        path: 'paymentsbydate',
        loadChildren: () => import('../paymentbydate/paymentbydate.module').then(m => m.PaymentbydateModule)
      },
      {
        path: 'assignamentcollections',
        loadChildren: () => import('../assignamentcollection/assignamentcollection.module').then(m => m.AssignamentcollectionModule)
      },
      {
        path: 'permissions',
        loadChildren: () => import('../permission/permission.module').then(m => m.PermissionModule)
      },
      {
        path: 'paymentcanceleds',
        loadChildren: () => import('../paymentcanceled/paymentcanceled.module').then(m => m.PaymentcanceledModule)
      },
      {
        path: 'requestpayments',
        loadChildren: () => import('../requestpayment/requestpayment.module').then(m => m.RequestpaymentModule)
      },
      {
        path: 'requestreturns',
        loadChildren: () => import('../requestreturn/requestreturn.module').then(m => m.RequestreturnModule)
      },
      {
        path: 'requestsales',
        loadChildren: () => import('../requestsale/requestsale.module').then(m => m.RequestsaleModule)
      },
      {
        path: 'configurationsystem',
        loadChildren: () => import('../configuration-system/configuration-system.module').then(m => m.ConfigurationSystemModule)
      },
      {
        path: 'incidences',
        loadChildren: () => import('../incidence/incidence.module').then(m => m.IncidenceModule)
      },
      {
        path: 'reasonsincidences',
        loadChildren: () => import('../reasons-incidences/reasons-incidences.module').then(m => m.ReasonsIncidencesModule)
      },
      {
        path: 'reasonsreturns',
        loadChildren: () => import('../reasons-returns/reasons-returns.module').then(m => m.ReasonsReturnsModule)
      },
      {
        path: 'trucks',
        loadChildren: () => import('../truck/truck.module').then(m => m.TruckModule)
      },
      {
        path: 'import-data',
        loadChildren: () => import('../import/import.module').then(m => m.ImportModule)
      },
      // { path: 'helpdesk', component:  },
      { path: 'not-found', component: NotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }