import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import * as firebase from 'firebase'

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { AuthProvider } from '../providers/auth/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // @ViewChild('content') nav: NavController
  rootPage: any;
  firebaseConfig = {
    apiKey: 'AIzaSyB5E19ipP5QgggHWrzfJi46wSqu4x2DXDY',
    authDomain: 'settle-up-b921a.firebaseapp.com',
    databaseURL: 'https://settle-up-b921a.firebaseio.com',
    projectId: 'settle-up-b921a',
    storageBucket: 'settle-up-b921a.appspot.com',
    messagingSenderId: '518509991002'
  };

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public authProvider: AuthProvider
  ) {
    firebase.initializeApp(this.firebaseConfig);
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  ngOnInit()	{
  firebase.auth().onAuthStateChanged( user => {
      if (!user) {
        console.log('No user found');
        this.rootPage = LoginPage;
      } else { 
        console.log(user.email);      
        this.rootPage = TabsPage;
      }
    });
  }
  
  // logoutUser() {
  //   this.authProvider.logoutUser();
  //   this.rootPage = 'login';    
  //   //this.nav.setRoot(LoginPage);
  // }

}
