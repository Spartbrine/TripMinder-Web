// Angular Core
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  BrowserModule,
  HammerGestureConfig,
  HAMMER_GESTURE_CONFIG,
} from '@angular/platform-browser';
import { NgModule, LOCALE_ID, Injectable } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { AppComponent } from './app.component';
import { MasterComponent } from './@pages/layouts/master/master.component';

import {
  FontAwesomeModule,
  FaIconLibrary
} from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { NgSelectModule } from '@ng-select/ng-select';

// Layout Service - Required
import { pagesToggleService } from './@pages/services/toggler.service';

// Shared Layout Components
import { SidebarComponent } from './@pages/components/sidebar/sidebar.component';
import { QuickviewComponent } from './@pages/components/quickview/quickview.component';
import { QuickviewService } from './@pages/components/quickview/quickview.service';
import { SearchOverlayComponent } from './@pages/components/search-overlay/search-overlay.component';
import { HeaderComponent } from './@pages/components/header/header.component';
import { HorizontalMenuComponent } from './@pages/components/horizontal-menu/horizontal-menu.component';
import { SharedModule } from './@pages/components/shared.module';
import { pgListViewModule } from './@pages/components/list-view/list-view.module';
import { pgCardModule } from './@pages/components/card/card.module';
import { pgCardSocialModule } from './@pages/components/card-social/card-social.module';
// import { pgDatePickerModule } from './@pages/components/datepicker/datepicker.module';
import { MarkdownModule } from 'ngx-markdown';
// Basic Bootstrap Modules
import { AlertModule } from 'ngx-bootstrap/alert';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {AccordionModule} from 'ngx-bootstrap/accordion';
import { PopoverModule } from 'ngx-bootstrap/popover';

// Pages Globaly required Components - Optional
import { pgTabsModule } from './@pages/components/tabs/tabs.module';
import { pgSwitchModule } from './@pages/components/switch/switch.module';
import { ProgressModule } from './@pages/components/progress/progress.module';
import { pgDatePickerModule } from './@pages/components/datepicker/datepicker.module';
import { pgSelectModule} from './@pages/components/select/select.module';
import { pgTagModule } from './@pages/components/tag/tag.module';
import { pgUploadModule } from './@pages/components/upload/upload.module';
import { MessageModule } from './@pages/components/message/message.module';
import { MessageService } from './@pages/components/message/message.service';

// Thirdparty Components / Plugins - Optional
import { QuillModule } from 'ngx-quill';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';


// Components from App/Components

import { RootLayout } from './@pages/layouts';
import {
  GridViewComponent,
  HomeComponent,
  LoginComponent,
  NotFoundComponent,
  // UsersComponent,
  ProfilesComponent,
  TooltipFormComponent,
  UserAccountComponent,

  /* Dialog */
  // CreateUsersDialogComponent,
  CreateProfileDialogComponent,
  /* Common modules */
  // FilterTagsComponent,
  // SkeletonLoadingComponent,
  // SubjectSvgComponent,
  // RadioGroupComponent,
  // NotDataComponent
} from './components';

import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './components/home/home.module';
import { MatNativeDateModule } from '@angular/material/core';
// import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { JwtInterceptor } from 'shared/helpers/jwt.interceptor';
import { ErrorInterceptor } from 'shared/helpers/error.interceptor';

import { MatStepperModule } from '@angular/material/stepper';
import { MatSidenavModule } from '@angular/material/sidenav';

import { QRCodeModule } from 'angularx-qrcode';

import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { registerLocaleData } from '@angular/common';
import localeEsMx from '@angular/common/locales/es-MX';
import { TableWidgetComponent } from './@pages/components/widgets/table-widget/table-widget.component';
// import { GoogleChartsModule } from 'angular-google-charts';
import { TreeModule } from 'angular-tree-component';
import { TemplateReportCardModule } from './components/common/template-report-card/template-report-card.module';
import { MainModule } from './components/common';
import { NgxColorsModule } from 'ngx-colors';
import { SupplierComponent } from './components/supplier/supplier.component';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
};

// Hammer Config Overide
// https://github.com/angular/angular/issues/10541
@Injectable()
export class AppHammerConfig extends HammerGestureConfig {
  overrides = {
    pinch: { enable: false },
    rotate: { enable: false },
  } as any;
}

registerLocaleData(localeEsMx, 'es-MX');

@NgModule({
    declarations: [
        /* Components */
        TableWidgetComponent,
        AppComponent,
        SidebarComponent,
        QuickviewComponent,
        SearchOverlayComponent,
        HeaderComponent,
        HorizontalMenuComponent,
        GridViewComponent,
        TooltipFormComponent,
        RootLayout,
        MasterComponent,
        HomeComponent,
        LoginComponent,
        NotFoundComponent,
        ProfilesComponent,
        UserAccountComponent,
        /* Dialogs */
        CreateProfileDialogComponent,
        /* Others */
        
    ],
    imports: [
        MainModule,
        TemplateReportCardModule,
        QRCodeModule,
        pgSelectModule,
        pgDatePickerModule,
        MatIconModule,
        MatStepperModule,
        MatSidenavModule,
        // MatDatepickerModule,
        // MatNativeDateModule,
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        // CommonModules,
        FormsModule,
        NgSelectModule,
        HttpClientModule,
        SharedModule,
        ProgressModule,
        pgListViewModule,
        pgCardModule,
        pgCardSocialModule,
        pgDatePickerModule,
        pgSelectModule,
        HomeModule,
        MatDialogModule,
        FontAwesomeModule,
        AppRoutingModule,
        BsDropdownModule.forRoot(),
        AccordionModule.forRoot(),
        AlertModule.forRoot(),
        ButtonsModule.forRoot(),
        CollapseModule.forRoot(),
        ModalModule.forRoot(),
        ProgressbarModule.forRoot(),
        TabsModule.forRoot(),
        TooltipModule.forRoot(),
        TypeaheadModule.forRoot(),
        pgTabsModule,
        PerfectScrollbarModule,
        pgSwitchModule,
        QuillModule.forRoot(),
        TypeaheadModule,
        pgTagModule,
        ReactiveFormsModule,
        pgUploadModule,
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        AngularFireMessagingModule,
        AngularFireModule,
        TreeModule.forRoot(),
        MessageModule,
        PopoverModule.forRoot(),
        NgxColorsModule
    ],
    providers: [
        QuickviewService,
        AsyncPipe,
        pagesToggleService,
        MessageService,
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
        },
        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: AppHammerConfig,
        },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: LOCALE_ID, useValue: 'es-MX' },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far);
  }
}
