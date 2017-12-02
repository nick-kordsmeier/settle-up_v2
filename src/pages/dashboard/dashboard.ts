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
    // let uid = this.authProvider.getUID();
    // console.log(uid);

      //if ( this.authProvider.userInfo.newUser ) this.authProvider.checkRedirect();
      //else console.log("Not new user");      

  }

  logout() {
    this.authProvider.logoutUser();
    this.navCtrl.setRoot(LoginPage);
  }


}
