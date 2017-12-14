import { Component } from '@angular/core';
import { NavController, PopoverController } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth'
import { SettleUpDbProvider } from '../../providers/settle-up-db/settle-up-db';

import { LoginPage } from '../login/login';
import { PopoverMenuComponent } from '../../components/popover-menu/popover-menu'


@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {
  currentUID;
  currentUserInfo;
  connections = [];
  youOwe = 0;
  yourFriendsOwe = 0;

  constructor(
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    private authProvider: AuthProvider,
    private settleUpProvider: SettleUpDbProvider
  ) {
  }

  ionViewWillEnter() {
    this.currentUID = this.authProvider.getUID();
  }

  ionViewDidEnter() {
    this.settleUpProvider.getUserData(this.currentUID).then(uidData => {
      this.currentUserInfo = uidData;
      console.log(this.currentUserInfo)
      
      this.connections = []
      let connectionKeys = Object.keys(this.currentUserInfo.connections);
      for (let i = 0; i < connectionKeys.length; i++) {
        this.connections.push(this.currentUserInfo.connections[`${connectionKeys[i]}`]);
      }
      console.log(this.connections);

      this.youOwe = 0;
      this.yourFriendsOwe = 0;
      for (let i = 0; i < this.connections.length; i++) {
        if (this.connections[i].balance.value < 0) {
          this.youOwe -= this.connections[i].balance.value;
        } else if (this.connections[i].balance.value > 0) {
          this.yourFriendsOwe += this.connections[i].balance.value;
        }
      }
    }).catch(err => { console.error(err) });;

  }

  logout() {
    this.authProvider.logoutUser();
    this.navCtrl.setRoot(LoginPage);
  }

  presentPopover(ev: UIEvent, currentUserInfo) {
    let popover = this.popoverCtrl.create(PopoverMenuComponent, {currentUserInfo: currentUserInfo}, {cssClass: "popover-menu"});

    popover.present({ev: ev});
  }



}
