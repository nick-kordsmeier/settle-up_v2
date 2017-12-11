import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { SettleUpDbProvider } from '../../providers/settle-up-db/settle-up-db';
import { NewPurchasePage } from '../new-purchase/new-purchase';
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
    });


    this.settleUpProvider.getGroupDetails(this.navParams.get("key")).then( groupDetailsData => {
      this.groupDetails = groupDetailsData;
      this.groupMembers = this.groupDetails.members;
      console.log(this.groupDetails)

      for (let i = 0; i < this.groupMembers.length; i++) {
        if (this.groupMembers[i].uid) {
          if (this.groupMembers[i].uid === this.currentUserInfo.uid) {
            this.activeUserGroupID = i;
          }        
        }
      }
      console.log(this.activeUserGroupID);
    });
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
}
