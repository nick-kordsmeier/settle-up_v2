import { Component } from '@angular/core';
import { NavController, PopoverController } from 'ionic-angular';

import { NewPurchasePage } from '../new-purchase/new-purchase';
import { PopoverMenuComponent } from '../../components/popover-menu/popover-menu'
import { AuthProvider } from '../../providers/auth/auth';
import { SettleUpDbProvider } from '../../providers/settle-up-db/settle-up-db';


@Component({
  selector: 'page-purchases',
  templateUrl: 'purchases.html'
})
export class PurchasesPage {
  currentUID;
  currentUserInfo;
  

  constructor(
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    private authProvider: AuthProvider,
    private settleUpProvider: SettleUpDbProvider,
  ) {

  }

  ionViewWillEnter() {
    this.currentUID = this.authProvider.getUID();
  }

  ionViewDidEnter() {
    this.settleUpProvider.getUserData(this.currentUID).then(uidData => {
      this.currentUserInfo = uidData;
      console.log(this.currentUserInfo)
    });

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

  goToNewPurchase() {
    console.log('New Purchase');
    this.navCtrl.push(NewPurchasePage);
  }

  presentPopover(ev: UIEvent) {
    let popover = this.popoverCtrl.create(PopoverMenuComponent);

    popover.present({
      ev: ev
    });
  }

}
