import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

// @IonicPage()
@Component({
  selector: 'page-new-purchase',
  templateUrl: 'new-purchase.html',
})
export class NewPurchasePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('Cancel');    
  }

  saveNewPurchase() {
    console.log('Saved New Purchase')
    this.navCtrl.pop();
  }

}
