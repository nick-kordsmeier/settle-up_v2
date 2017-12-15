import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { SettleUpDbProvider } from '../../providers/settle-up-db/settle-up-db';
import { AuthProvider } from '../../providers/auth/auth';
import { EditPurchasePage } from '../edit-purchase/edit-purchase';

@Component({
  selector: 'page-purchase-details',
  templateUrl: 'purchase-details.html',
})
export class PurchaseDetailsPage {
  purchase;
  currentUID;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private authProvider: AuthProvider, private settleUpProvider: SettleUpDbProvider) {
  }

  ionViewWillEnter() {
    this.currentUID = this.authProvider.getUID();
  }

  ionViewDidEnter() {
    this.purchase = this.navParams.get("purchase");
    console.log(this.purchase);

  }

  goToEditPurchase(purchase) {
    console.log('Edit Purchase Details');
    this.navCtrl.pop().then( () => {
      this.navCtrl.push(EditPurchasePage, {purchase: purchase});      
    })
  }

}