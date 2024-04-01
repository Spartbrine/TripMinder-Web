import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { JwtInterceptor } from 'shared/helpers/jwt.interceptor';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HomeRoutingModule,

  ],
  providers: [
    JwtInterceptor,
  ],
})
export class HomeModule { }
