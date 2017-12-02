import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { GroupsPage } from '../pages/groups/groups';
import { PurchasesPage } from '../pages/purchases/purchases';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { NewGroupPage } from '../pages/new-group/new-group';
import { NewPurchasePage } from '../pages/new-purchase/new-purchase';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import * as firebase from 'firebase'

import { AuthProvider } from '../providers/auth/auth';
import { SettleUpDbProvider } from '../providers/settle-up-db/settle-up-db';

@NgModule({
  declarations: [
    MyApp,
    GroupsPage,
    PurchasesPage,
    DashboardPage,
    TabsPage,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    NewGroupPage,
    NewPurchasePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    DashboardPage,
    GroupsPage,
    PurchasesPage,
    TabsPage,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    NewGroupPage,
    NewPurchasePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    SettleUpDbProvider
  ]
})
export class AppModule {}
