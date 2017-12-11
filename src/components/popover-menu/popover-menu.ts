import { Component } from '@angular/core';
import { ViewController, NavController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

import { LoginPage } from '../../pages/login/login';

@Component({
  selector: 'popover-menu',
  templateUrl: 'popover-menu.html'
})
export class PopoverMenuComponent {

  text: string;

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, private authProvider: AuthProvider) {

  }

  close() {
    this.viewCtrl.dismiss();
  }

  logout() {
    this.authProvider.logoutUser();
    this.navCtrl.setRoot(LoginPage);
  }

}
