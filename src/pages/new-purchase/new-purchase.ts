import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { SettleUpDbProvider } from '../../providers/settle-up-db/settle-up-db';
import { AuthProvider } from '../../providers/auth/auth';

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
  groupKeys;

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

    if(this.navParams.get("key")) {
      this.settleUpProvider.getGroupDetails(this.navParams.get("key")).then( groupDetailData => {
        this.groupDetails = groupDetailData;
        this.groupMembers = this.groupDetails.members;
        this.groupVal = this.groupDetails.groupName;
        console.log("group details")
        console.log(this.groupDetails);
  
        if (this.groupDetails.numPurchases) {
          this.numPurchases = this.groupDetails.numPurchases; 
        } else this.numPurchases = 0;
      }).catch(err => { console.error(err) });  
    }

        
    this.settleUpProvider.getActiveUserGroup(this.currentUID).then(activeUserGroupsData => {
      this.groupsObj = activeUserGroupsData;
      this.groupKeys = Object.keys(this.groupsObj);
      this.groups = [];
      for (let i = 0; i < this.groupKeys.length; i++) {
        this.groups.push(this.groupsObj[this.groupKeys[i]]);
      }
      console.log(this.groups);

    }).catch(err => { console.error(err) });
  }

  onSaveNewPurchase() {

    let groupIndex = this.groups.findIndex(element => element["groupName"] === this.groupVal);
    console.log(groupIndex);
    console.log(this.groups[groupIndex]);
    this.settleUpProvider.getGroupDetails(this.groups[groupIndex].key).then( groupDetailData => {
      this.groupDetails = groupDetailData;
      this.groupMembers = this.groupDetails.members;
      this.groupVal = this.groupDetails.groupName;
      console.log("group details")
      console.log(this.groupDetails);

      if (this.groupDetails.numPurchases) {
        this.numPurchases = this.groupDetails.numPurchases; 
      } else this.numPurchases = 0;

      const today = new Date();
      console.log(today);
      const newPurchaseObj = {
        item: this.itemVal,
        purchaseDescription: this.descriptionVal,
        price: this.priceVal,
        forWho: this.forWhoVal,
        occasion: this.occasionVal,
        boughtFrom: this.boughtFromVal,
        datePurchased: this.datePurchasedVal,
        dateAddedNum: today.getTime(),
        addedByUID: this.currentUID,
        addedByName: this.currentUserInfo.displayName,
        groupName: this.groupVal,
        groupKey: this.groupDetails.key
      }
      this.numPurchases++
      this.saveNewPurchase(this.groupDetails.key, newPurchaseObj, this.numPurchases, this.currentUID, this.groupMembers);
    }).catch(err => { console.error(err) });  
    

  }

  saveNewPurchase(groupKey, newPurchaseObj, numPurchases, uid, groupMembers) {
    this.settleUpProvider.pushNewPurchase(groupKey, newPurchaseObj, numPurchases, uid, groupMembers);
    this.navCtrl.pop();

    // Update each group members' balances.
    let purchasePrice = newPurchaseObj.price;
    console.log(purchasePrice);
    let numMembers = this.groupMembers.length;
    console.log(numMembers);
    console.log(purchasePrice/numMembers)

    for (let i = 0; i < numMembers; i ++) {
      for (let j = 0; j < numMembers; j++) {
        if (this.groupMembers[i].uid === this.currentUID) {
          if (this.groupMembers[i].uid !== this.groupMembers[j].uid) {
            console.log("Before")
            console.log(this.groupMembers[i][`${this.groupMembers[i].uid}-${this.groupMembers[j].uid}`]);
            this.groupMembers[i][`${this.groupMembers[i].uid}-${this.groupMembers[j].uid}`] += (purchasePrice/numMembers)
            console.log("After")
            console.log(this.groupMembers[i][`${this.groupMembers[i].uid}-${this.groupMembers[j].uid}`]);
          }
        }
      }
      if (this.groupMembers[i].uid !== this.currentUID) {
        this.groupMembers[i][`${this.groupMembers[i].uid}-${this.currentUID}`] -= (purchasePrice/numMembers)
        console.log("If subtracting");
        console.log(this.groupMembers[i][`${this.groupMembers[i].uid}-${this.currentUID}`]);
      }
    }

    this.updateBalances(this.groupDetails.key, this.groupMembers, purchasePrice, numMembers, this.currentUID);
  }

  updateBalances(groupDetailsKey, groupMembers, purchasePrice, numMembers, currentUID) {
    this.settleUpProvider.updateBalances(groupDetailsKey, groupMembers, purchasePrice, numMembers, currentUID);
  }
}

