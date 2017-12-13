import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

import { LoginPage } from '../../pages/login/login';

@Component({
  selector: 'popover-menu',
  templateUrl: 'popover-menu.html'
})
export class PopoverMenuComponent {
  currentUserInfo;

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, private authProvider: AuthProvider) {
    this.currentUserInfo = this.navParams.get("currentUserInfo");

  }

  close() {
    this.viewCtrl.dismiss();
  }

  logout() {
    this.viewCtrl.dismiss().then( () => {
      this.authProvider.logoutUser();
      this.navCtrl.setRoot(LoginPage);
    }).catch(err => { console.error(err) });

  }

}
