import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
//import { NguUtilityModule } from '../../../node_modules/ngu-utility/ngu-utility.module'

import { SettleUpDbProvider } from '../../providers/settle-up-db/settle-up-db'
import { AuthProvider } from '../../providers/auth/auth';

import { Observable } from 'rxjs/Observable'

import { AddMoreMembersModalComponent } from '../../components/add-more-members-modal/add-more-members-modal';
import { dispatchEvent } from '@angular/core/src/view/util';


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
  moreMembers;

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

    addMoreMembersModal.onDidDismiss(selectedNames => {
      console.log("Did dismiss.");
      console.log(selectedNames);
      this.moreMembers = selectedNames;
      
      this.moreMembers = {
        [this.currentUserInfo.displayName]: {
          displayName: this.currentUserInfo.displayName,
          uid: this.currentUID,
          admin: true
        }
      }

      console.log("Selected Names = " + selectedNames.length);
  
      for (let i = 0; i < selectedNames.length; i++) {
        this.moreMembers[selectedNames[i].displayName] = {
          displayName: selectedNames[i].displayName,
          uid: selectedNames[i].uid,
          admin: false
        }

        console.log(this.moreMembers);       
      }
  
    });
    
  }

  onSaveNewGroup() {
    this.saveNewGroup(this.newGroupName, this.newGroupDescription);
  }

  saveNewGroup(newGroupName: string, newGroupDescription: any) {
    if (!newGroupDescription) newGroupDescription = null;

    this.settleUpProvider.pushNewGroup({
      groupName: newGroupName,
      groupDescription: newGroupDescription,
      members: this.moreMembers,
    });
    this.navCtrl.pop();
  }

}
