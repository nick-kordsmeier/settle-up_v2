import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { SettleUpDbProvider } from '../../providers/settle-up-db/settle-up-db'
import { AuthProvider } from '../../providers/auth/auth';

// @IonicPage()
@Component({
  selector: 'page-new-group',
  templateUrl: 'new-group.html',
})
export class NewGroupPage {
  newGroupName: string;
  newGroupDescription: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private DB: SettleUpDbProvider,
    private authProvider: AuthProvider) {
      console.log(this.authProvider.userInfo);
  }

  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('Cancel');
  }

  onSaveNewGroup() {
    this.saveNewGroup(this.newGroupName, this.newGroupDescription);
    this.newGroupName = '';
  }

  saveNewGroup(newGroupName: string, newGroupDescription: string) {
    let currentUID = this.authProvider.getUserInfo(); 
    //console.log(currentUID);
    this.DB.pushNewGroup({
      groupName: newGroupName,
      groupDescription: newGroupDescription,
      users: {
        currentUID: {
          admin: true
        }
      }
    });
    this.navCtrl.pop();
  }

}
