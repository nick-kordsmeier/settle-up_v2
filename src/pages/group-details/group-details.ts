import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { SettleUpDbProvider } from '../../providers/settle-up-db/settle-up-db';
import { NewPurchasePage } from '../new-purchase/new-purchase';
import { PurchasesPage } from '../purchases/purchases';


import { Observable } from 'rxjs/Observable'

// @IonicPage()
@Component({
  selector: 'page-group-details',
  templateUrl: 'group-details.html',
})
export class GroupDetailsPage {
  groupDetails;
  groupMembers;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private settleUpProvider: SettleUpDbProvider,    
  ) {
    this.settleUpProvider.getGroupDetails(this.navParams.get("key")).then( data => {
      this.groupDetails = data;
      this.groupMembers = this.groupDetails.members;
      console.log(this.groupDetails)
    }
    )

  }

  ionViewDidLoad() {
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
