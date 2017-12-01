import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { NewPurchasePage } from '../new-purchase/new-purchase';

@Component({
  selector: 'page-purchases',
  templateUrl: 'purchases.html'
})
export class PurchasesPage {

  constructor(public navCtrl: NavController) {

  }

  goToNewPurchase() {
    console.log('New Purchase');
    this.navCtrl.push(NewPurchasePage);
  }

}
