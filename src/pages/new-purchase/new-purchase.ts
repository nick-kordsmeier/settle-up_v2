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
  numPurchases: number;

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
      this.groupVal = this.groupDetails.groupName;
      console.log(this.groupDetails);

      if (this.groupDetails.numPurchases) {
        this.numPurchases = this.groupDetails.numPurchases; 
      } else this.numPurchases = 0;
    });

    this.settleUpProvider.getActiveUserGroup(this.currentUID).then(data => {
      this.groupsObj = data;
      let groupKeys = Object.keys(this.groupsObj);
      for (let i = 0; i < groupKeys.length; i++) {
        this.groups.push(this.groupsObj[groupKeys[i]]);
      }
      console.log(this.groups);

    });
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
    this.numPurchases++
    this.saveNewPurchase(this.groupDetails.key, newPurchaseObj, this.numPurchases, this.currentUID, this.groupMembers);
  }

  saveNewPurchase(groupKey, newPurchaseObj, numPurchases, uid, groupMembers) {
    this.settleUpProvider.pushNewPurchase(groupKey, newPurchaseObj, numPurchases, uid, groupMembers);
    this.navCtrl.pop();

    // Update each group members' balances.
    let purchaserIndex = groupMembers.findIndex(element => element["uid"] === uid);
    console.log(purchaserIndex);
    let purchasePrice = newPurchaseObj.price;
    console.log(purchasePrice);
    let numMembers = this.groupMembers.length;
    console.log(numMembers);

    for (let i = 0; i < numMembers; i ++) {
      for (let j = 0; j < numMembers; j++) {        
        if (i === purchaserIndex) {
          if (i !== j) {
            this.groupMembers[i][`${i}-${j}`] += purchasePrice/numMembers
          }
        } else {
          if (i !== j) {
            this.groupMembers[i][`${i}-${j}`] -= purchasePrice/numMembers
          }
        }
      }
    }

    this.updateBalances();
  }

  updateBalances() {
    this.settleUpProvider.updateBalances(this.groupDetails.key, this.groupMembers);;
  }




}

