import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { SettleUpDbProvider } from '../../providers/settle-up-db/settle-up-db';
import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'page-edit-purchase',
  templateUrl: 'edit-purchase.html',
})
export class EditPurchasePage {
  purchase;
  purchaseCopy;
  group;
  currentUID;

  groupVal;
  itemVal;
  priceVal;
  descriptionVal = null;
  forWhoVal = null;
  occasionVal = null;
  datePurchasedVal = null;
  boughtFromVal = null;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private authProvider: AuthProvider, private settleUpProvider: SettleUpDbProvider) {
  }

  ionViewWillEnter() {
    this.currentUID = this.authProvider.getUID();
  }

  ionViewDidEnter() {
    this.purchase = this.navParams.get("purchase");
    console.log(this.purchase);
    this.purchaseCopy = this.purchase;

    this.settleUpProvider.getGroupDetails(this.purchase.groupKey).then( groupDetailsData => {
    this.group = groupDetailsData;
    });

    this.groupVal = this.purchase.groupName;
    this.itemVal = this.purchase.item;
    this.priceVal = this.purchase.price;

    if (this.purchase.purchaseDescription) this.descriptionVal = this.purchase.purchaseDescription;
    if (this.purchase.forWho) this.forWhoVal = this.purchase.forWho;
    if (this.purchase.occasion) this.occasionVal = this.purchase.occasion;
    if (this.purchase.datePurchased) this.datePurchasedVal = this.purchase.datePurchased;
    if (this.purchase.boughtFrom) this.boughtFromVal = this.purchase.boughtFrom;
  }

  onDelete() {
    this.presentConfirm();
  }

 // for (let i = 0; i< this.activeGroups.length; i++) {
//   this.settleUpProvider.getGroupDetails(this.activeGroups[i].key).then( groupDetailData => {
//     this.groups.push(groupDetailData);
//   }).catch(err => { console.error(err)});
//   console.log(this.groups);
// }

  presentConfirm() {
    if (this.currentUID === this.purchase.addedByUID) {
      let alert = this.alertCtrl.create({
        title: 'Are you sure?',
        message: 'All purchase data will be lost.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log("Cancel selected");
            }
          },
          {
            text: 'Delete',
            handler: () => { 
              console.log("Delete selected");
              console.log("Update balances");

              // Update each group members' balances.
              let purchasePrice = this.purchase.price;
              console.log(purchasePrice);
              let numMembers = this.group.members.length;
              console.log(numMembers);
              console.log(purchasePrice/numMembers)

              for (let i = 0; i < numMembers; i ++) {
                for (let j = 0; j < numMembers; j++) {
                  if (this.group.members[i].uid === this.currentUID) {
                    if (this.group.members[i].uid !== this.group.members[j].uid) {
                      console.log("Before")
                      console.log(this.group.members[i][`${this.group.members[i].uid}-${this.group.members[j].uid}`]);
                      this.group.members[i][`${this.group.members[i].uid}-${this.group.members[j].uid}`] -= (purchasePrice/numMembers)
                      console.log("After")
                      console.log(this.group.members[i][`${this.group.members[i].uid}-${this.group.members[j].uid}`]);
                    }
                  }
                }
                if (this.group.members[i].uid !== this.currentUID) {
                  this.group.members[i][`${this.group.members[i].uid}-${this.currentUID}`] += (purchasePrice/numMembers)
                  console.log("If subtracting");
                  console.log(this.group.members[i][`${this.group.members[i].uid}-${this.currentUID}`]);
                }
              }

              this.settleUpProvider.updateBalances(this.purchaseCopy.groupKey, this.group.members, (this.purchaseCopy.price * -1), numMembers, this.currentUID)
                console.log("Delete Purchase data");
                this.settleUpProvider.deletePurchase(this.purchase);
                this.navCtrl.pop();
            }
          }
        ]
      });
      alert.present()
    } else {
      let alert = this.alertCtrl.create({
        title: 'Sorry!',
        message: 'Only the purchase creator can delete this purchase.',
        buttons: ['Dismiss']
    });
    alert.present();
  }
}

onSubmitEdits() {
  const today = new Date();
  console.log(today);
  const updatedPurchaseObj = {
    item: this.itemVal,
    purchaseDescription: this.descriptionVal,
    price: this.priceVal,
    forWho: this.forWhoVal,
    occasion: this.occasionVal,
    boughtFrom: this.boughtFromVal,
    datePurchased: this.datePurchasedVal,
    dateEditedNum: today.getTime(),
    dateAddedNum: this.purchase.dateAddedNum,
    addedByUID: this.currentUID,
    addedByName: this.purchase.addedByName,
    groupName: this.purchase.groupName,
    groupKey: this.purchase.groupKey,
    key: this.purchase.key
  }

  this.settleUpProvider.editPurchase(updatedPurchaseObj);
  this.navCtrl.pop();
}

}
