import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { SettleUpDbProvider } from '../../providers/settle-up-db/settle-up-db';
import { AuthProvider } from '../../providers/auth/auth';

// @IonicPage()
@Component({
  selector: 'page-new-purchase',
  templateUrl: 'new-purchase.html',
})
export class NewPurchasePage {
  groupDetails;
  groupMembers;
  currentUID: string;
  currentUserInfo;
  groupsObj;  
  groups = [];

  groupVal;
  itemVal;
  priceVal;
  descriptionVal = null;
  forWhoVal = null;
  occasionVal = null;
  datePurchasedVal = null;
  boughtFromVal = null;

  newPurchaseObj;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authProvider: AuthProvider,
    private settleUpProvider: SettleUpDbProvider
  ) {
    this.currentUID = this.authProvider.getUID();
    
    this.settleUpProvider.getGroupDetails(this.navParams.get("key")).then( data => {
      this.groupDetails = data;
      this.groupMembers = this.groupDetails.members;
      console.log(this.groupDetails)

      this.groupVal = this.groupDetails.groupName;
    });

    this.settleUpProvider.getActiveUserGroup(this.currentUID).then(data => {
      console.log("getting groups:");
      console.log(data);
      this.groupsObj = data;

      console.log(this.groupsObj);
      let groupKeys = Object.keys(this.groupsObj);
      console.log(groupKeys);
      for (let i = 0; i < groupKeys.length; i++) {
        this.groups.push(this.groupsObj[groupKeys[i]]);
        console.log(this.groups);
      }
    });
    //this.groups = [{groupName: "test1"}, {groupName: "test2"}];
  }

  ionViewWillEnter() {
    this.settleUpProvider.getUserData(this.currentUID).then(data => {
      this.currentUserInfo = data;
    });        
  }

  onSaveNewPurchase() {
    const today = new Date();
    const newPurchaseObj = {
      item: this.itemVal,
      purchaseDescription: this.descriptionVal,
      price: this.priceVal,
      forWho: this.forWhoVal,
      occasion: this.occasionVal,
      boughtFrom: this.boughtFromVal,
      datePurchased: this.datePurchasedVal,
      dateAdded: today,
      addedByUID: this.currentUID,
      addedByName: this.currentUserInfo.displayName,
      groupName: this.groupVal,
      groupKey: this.groupDetails.key
    }

    this.saveNewPurchase(this.groupDetails.key, newPurchaseObj);
  }

  saveNewPurchase(groupKey, newPurchaseObj) {
    this.settleUpProvider.pushNewPurchase(groupKey, newPurchaseObj);
    this.navCtrl.pop();
  }


}

