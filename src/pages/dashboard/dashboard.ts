import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth'
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

  constructor(public navCtrl: NavController, public authProvider: AuthProvider) {
  }

  ionViewDidLoad()	{
    if ( this.authProvider.loggedInWithProvider ) this.authProvider.checkRedirect();
  }

  logout() {
    this.authProvider.logoutUser();
    this.navCtrl.setRoot(LoginPage);
  }


}
