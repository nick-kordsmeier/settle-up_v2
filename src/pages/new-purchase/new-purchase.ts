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

  }

  ionViewWillEnter() {
    this.currentUID = this.authProvider.getUID();
  }

  ionViewDidEnter() {
    this.settleUpProvider.getUserData(this.currentUID).then(uidData => {
      this.currentUserInfo = uidData;
    });

    this.settleUpProvider.getGroupDetails(this.navParams.get("key")).then( groupDetailData => {
      this.groupDetails = groupDetailData;
      this.groupMembers = this.groupDetails.members;
      this.groupVal = this.groupDetails.groupName;
      console.log(this.groupDetails);

      if (this.groupDetails.numPurchases) {
        this.numPurchases = this.groupDetails.numPurchases; 
      } else this.numPurchases = 0;
    });

        
    this.settleUpProvider.getActiveUserGroup(this.currentUID).then(activeUserGroupsData => {
      this.groupsObj = activeUserGroupsData;
      let groupKeys = Object.keys(this.groupsObj);
      for (let i = 0; i < groupKeys.length; i++) {
        this.groups.push(this.groupsObj[groupKeys[i]]);
      }
      console.log(this.groups);

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
    console.log(purchasePrice/numMembers)

    for (let i = 0; i < numMembers; i ++) {
      for (let j = 0; j < numMembers; j++) {
        if (i === purchaserIndex) {
          if (i !== j) {
            console.log("Before")
            console.log(this.groupMembers[i][`${i}-${j}`]);
            this.groupMembers[i][`${i}-${j}`] += (purchasePrice/numMembers)
            console.log("After")
            console.log(this.groupMembers[i][`${i}-${j}`]);
          }
        }
      }
      if (i !== purchaserIndex) {
        this.groupMembers[i][`${i}-${purchaserIndex}`] -= (purchasePrice/numMembers)
        console.log("If subtracting");
        console.log(this.groupMembers[i][`${i}-${purchaserIndex}`]);
      }
    }

    this.updateBalances();
  }

  updateBalances() {
    this.settleUpProvider.updateBalances(this.groupDetails.key, this.groupMembers);;
  }




}

