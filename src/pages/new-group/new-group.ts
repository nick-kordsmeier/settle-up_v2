import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';

import { SettleUpDbProvider } from '../../providers/settle-up-db/settle-up-db'
import { AuthProvider } from '../../providers/auth/auth';

import { Observable } from 'rxjs/Observable'

import { AddMoreMembersModalComponent } from '../../components/add-more-members-modal/add-more-members-modal';


// @IonicPage()
@Component({
  selector: 'page-new-group',
  templateUrl: 'new-group.html',
})
export class NewGroupPage {
  newGroupName: string;
  newGroupDescription: string;
  currentUID: string;
  users: Observable<any[]>;
  usersObj
  currentUserInfo
  moreMembers = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    private settleUpProvider: SettleUpDbProvider,
    private authProvider: AuthProvider) {
      this.currentUID = this.authProvider.getUID();
    }

      
  ionViewWillEnter() {
    this.settleUpProvider.getUserData(this.currentUID).then(data => {
      this.currentUserInfo = data;
    });        
  }

  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('Cancel');
  }

  addMoreMembers() {
    console.log("Add members");
    let addMoreMembersModal = this.modalCtrl.create(AddMoreMembersModalComponent);
    addMoreMembersModal.present();

    addMoreMembersModal.onDidDismiss(addMoreMembersData => {
      console.log("Did dismiss.");
      console.log(addMoreMembersData);
    })

  }

  onSaveNewGroup() {
    this.saveNewGroup(this.newGroupName, this.newGroupDescription);
  }

  saveNewGroup(newGroupName: string, newGroupDescription: string) {
    this.settleUpProvider.pushNewGroup({
      groupName: newGroupName,
      groupDescription: newGroupDescription,
      users: {
        [this.currentUID]: {
          displayName: this.currentUserInfo.displayName,
          uid: this.currentUID,
          admin: true
        }
      },
    });
    this.navCtrl.pop();
  }

}
