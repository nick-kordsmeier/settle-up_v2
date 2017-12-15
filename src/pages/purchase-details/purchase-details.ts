import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

// @IonicPage()
@Component({
  selector: 'page-purchase-details',
  templateUrl: 'purchase-details.html',
})
export class PurchaseDetailsPage {
  deleteConfirm = false;
  purchase
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.purchase = this.navParams.get("purchase");
    console.log(this.purchase);
  }

  onDelete() {
    this.deleteConfirm = false;
    console.log("delete")
    this.presentConfirm()
    
    // .then( data => {
    //   let ifDelete = data;
    //   console.log(ifDelete);
      
      // if(ifDelete) {
      //     this.updateBalances(this.purchase.groupKey, this.group.members, (this.purchase.price * -1), this.group.numMembers, this.currentUID) // Need to add group data to this page.
      //     this.settleUpProvider.deletePurchase(purchase);
  //     }
  // })
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
    title: 'Are you sure?',
    message: 'All group data will be lost.',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          alert.dismiss(false);
            return false;
        }
      },
      {
        text: 'Delete',
        handler: () => {
          alert.dismiss(true);          
            return true;
        }
      }
    ]
  });
  alert.present().then( data => {
    console.log(data);
  });

  // console.log(this.deleteConfirm)
  
}
}


// return new Promise (resolve => {
//   resolve(false); // False, cancel selected
// });
// alert.dismiss();

// return new Promise (resolve => {
//   resolve(true); // True, delete selected
// });
// alert.dismiss();
