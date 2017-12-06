import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import * as firebase from 'firebase'

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { AuthProvider } from '../providers/auth/auth';
import { SettleUpDbProvider } from '../providers/settle-up-db/settle-up-db';
import { NativeContactsProvider } from '../providers/native-contacts/native-contacts';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // @ViewChild('content') nav: NavController
  rootPage: any;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private authProvider: AuthProvider,
    private settleUpProvider: SettleUpDbProvider,
    private nativeContactsProvider: NativeContactsProvider
  ) {

    firebase.auth().getRedirectResult().then( result => {
      if (result.credential) {
        console.log("success")
        this.settleUpProvider.getUserData(result.user.uid).then( userData => {
          if (!userData) {
            let userId = result.user.uid;
            let splitName = result.user.displayName.split(" ");
            firebase.database().ref('/userProfile').child(userId).set({
              email: result.user.email,
              displayName: result.user.displayName,
              firstName: splitName[0],
              lastName: splitName[1],
              photoURL: result.user.photoURL,
            });
            console.log("New FB user logged to database.");
          } else { console.log("This user already exists.")}
        })
      } else {
        console.log("User was already logged in.")
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    firebase.auth().onAuthStateChanged( user => {
      if (!user) {
        console.log('No user found');
        this.rootPage = LoginPage;
      } else { 
        this.rootPage = TabsPage;
      }
    });
  }


 }
  
  // logoutUser() {
  //   this.authProvider.logoutUser();
  //   this.rootPage = 'login';    
  //   //this.nav.setRoot(LoginPage);
  // }

