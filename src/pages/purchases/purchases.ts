import { Component } from '@angular/core';
import { NavController, PopoverController } from 'ionic-angular';

import { NewPurchasePage } from '../new-purchase/new-purchase';
import { PurchaseDetailsPage } from '../purchase-details/purchase-details';
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
  activeGroups;
  groupsObj;
  groups;
  purchases;
  sortedPurchases;

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
    }).catch(err => { console.error(err) });

    this.activeGroups = [];
    this.settleUpProvider.getActiveUserGroup(this.currentUID).then(activeUserGroupsData => {
      if (activeUserGroupsData !== null) { 
      this.groupsObj = activeUserGroupsData;
      let groupKeys = Object.keys(this.groupsObj);
      for (let i = 0; i < groupKeys.length; i++) {
        this.activeGroups.push(this.groupsObj[`${groupKeys[i]}`]);
      }
      console.log(this.groupsObj);
      console.log(this.activeGroups);

      this.groups = [];
      this.purchases = [];
      for (let i = 0; i< this.activeGroups.length; i++) {
        this.settleUpProvider.getGroupDetails(this.activeGroups[i].key).then( groupDetailData => {
          this.groups.push(groupDetailData);

          if (this.groups[i].purchases) {
          let purchasesKeys = Object.keys(this.groups[i].purchases);
          console.log(purchasesKeys);
          for (let k = 0; k < purchasesKeys.length; k++) {
            this.purchases.push(this.groups[i].purchases[`${purchasesKeys[k]}`]);
          }
        }
        }).catch(err => { console.error(err)});
        console.log(this.groups);
        console.log(this.purchases);
      }

      this.sortedPurchases = this.purchases.sort(this.compare);
      console.log(this.sortedPurchases)
    }
    }).catch(err => { console.error(err) });


  }

  goToNewPurchase() {
    console.log('New Purchase');
    this.navCtrl.push(NewPurchasePage);
  }

  presentPopover(ev: UIEvent, currentUserInfo) {
    let popover = this.popoverCtrl.create(PopoverMenuComponent, {currentUserInfo: currentUserInfo}, {cssClass: "popover-menu"});

    popover.present({ev: ev});
  }

  goToPurchaseDetails(purchase) {
    console.log('Purchase Details');
    this.navCtrl.push(PurchaseDetailsPage, {purchase: purchase});
  }

  compare(obj1, obj2) {
    if (obj1.key < obj2.key)
      return -1;
    if (obj1.key > obj2.key)
      return 1;
    return 0;
  }

}

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