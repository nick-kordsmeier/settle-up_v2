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
    }).catch(err => { console.error(err) });;

    // this.groups = [];
    // this.settleUpProvider.getActiveUserGroup(this.currentUID).then(activeUserGroupsData => {
    //   if (activeUserGroupsData !== null) { 
    //   this.groupsObj = activeUserGroupsData;
    //   let groupKeys = Object.keys(this.groupsObj);
    //   for (let i = 0; i < groupKeys.length; i++) {
    //     this.groups.push(this.groupsObj[groupKeys[i]]);
    //   }
    //   console.log(this.groups);
    // }
    // });
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
