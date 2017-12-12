import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Contacts } from '@ionic-native/contacts';

import { NguUtilityModule } from '../../node_modules/ngu-utility/dist'

import { GroupsPage } from '../pages/groups/groups';
import { PurchasesPage } from '../pages/purchases/purchases';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { NewGroupPage } from '../pages/new-group/new-group';
import { NewPurchasePage } from '../pages/new-purchase/new-purchase';
import { GroupDetailsPage } from '../pages/group-details/group-details';
import { PopoverMenuComponent } from '../components/popover-menu/popover-menu';
import { AddMoreMembersModalComponent } from '../components/add-more-members-modal/add-more-members-modal';
import { PurchaseDetailsPage } from '../pages/purchase-details/purchase-details';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database'

export const angularFirebaseConfig = {
  apiKey: 'AIzaSyB5E19ipP5QgggHWrzfJi46wSqu4x2DXDY',
  authDomain: 'settle-up-b921a.firebaseapp.com',
  databaseURL: 'https://settle-up-b921a.firebaseio.com',
  projectId: 'settle-up-b921a',
  storageBucket: 'settle-up-b921a.appspot.com',
  messagingSenderId: '518509991002'
};

import { AuthProvider } from '../providers/auth/auth';
import { SettleUpDbProvider } from '../providers/settle-up-db/settle-up-db';
import { NativeContactsProvider } from '../providers/native-contacts/native-contacts';

@NgModule({
  declarations: [
    MyApp,
    GroupsPage,
    GroupDetailsPage,
    PurchasesPage,
    DashboardPage,
    TabsPage,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    NewGroupPage,
    NewPurchasePage,
    AddMoreMembersModalComponent,
    PopoverMenuComponent,
    PurchaseDetailsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(angularFirebaseConfig),
    AngularFireDatabaseModule,
    NguUtilityModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    DashboardPage,
    GroupsPage,
    GroupDetailsPage,
    PurchasesPage,
    TabsPage,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    NewGroupPage,
    NewPurchasePage,
    AddMoreMembersModalComponent,
    PopoverMenuComponent,
    PurchaseDetailsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    SettleUpDbProvider,
    NativeContactsProvider,
    Contacts,
  ]
})
export class AppModule {}
