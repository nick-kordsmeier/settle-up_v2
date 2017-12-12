import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { SettleUpDbProvider } from '../../providers/settle-up-db/settle-up-db';
import { NewPurchasePage } from '../new-purchase/new-purchase';
import { PurchaseDetailsPage } from '../purchase-details/purchase-details';
import { PurchasesPage } from '../purchases/purchases';
import { AuthProvider } from '../../providers/auth/auth';


// @IonicPage()
@Component({
  selector: 'page-group-details',
  templateUrl: 'group-details.html',
})
export class GroupDetailsPage {
  currentUID;
  currentUserInfo;
  groupDetails;
  groupMembers;
  activeUserGroupID;
  purchases;
  purchasesObj;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private settleUpProvider: SettleUpDbProvider,
    private authProvider: AuthProvider
  ) {

  }


  ionViewWillEnter() {
    this.currentUID = this.authProvider.getUID();
  }

  ionViewDidEnter() {
    this.settleUpProvider.getUserData(this.currentUID).then(uidData => {
      this.currentUserInfo = uidData;
    }).catch(err => { console.error(err) });


    this.settleUpProvider.getGroupDetails(this.navParams.get("key")).then( groupDetailsData => {
      this.groupDetails = groupDetailsData;
      console.log(this.groupDetails);
      this.groupMembers = this.groupDetails.members;
      console.log(this.groupMembers);
      this.purchasesObj = this.groupDetails.purchases;
      console.log(this.purchasesObj);
      


      for (let i = 0; i < this.groupMembers.length; i++) {
        if (this.groupMembers[i].uid) {
          if (this.groupMembers[i].uid === this.currentUserInfo.uid) {
            this.activeUserGroupID = i;
          }        
        }
      }
      console.log(this.activeUserGroupID);

      this.purchases = [];
      if (this.purchasesObj) {
        console.log(this.purchases);
        let purchaseKeys = Object.keys(this.purchasesObj);
        console.log(purchaseKeys);
        for (let i = 0; i < purchaseKeys.length; i++) {
          this.purchases.push(this.purchasesObj[purchaseKeys[i]]);
          console.log(this.purchases);          
          }
      }

    }).catch(err => { console.error(err) });;
  }

  // switchToPurchasesTab() {
  //   return new Promise (resolve => {
  //     resolve(this.navCtrl.parent.select(2));
  // });
  // }

  goToNewPurchase(key) {
    // this.navCtrl.parent.select(2);
    this.navCtrl.push(NewPurchasePage, {key: key});

    

  //   this.switchToPurchasesTab().then( () => {
  //     this.navCtrl.parent.select(2)
  //     this.navCtrl.push(NewPurchasePage, {key: key});      
  //   });
  //   // this.navCtrl.parent.select(2).push(NewPurchasePage, {key: key});
  // }
  }

  goToPurchaseDetails(purchase) {
    console.log('Purchase Details');
    this.navCtrl.push(PurchaseDetailsPage, {purchase: purchase});
  }
}
