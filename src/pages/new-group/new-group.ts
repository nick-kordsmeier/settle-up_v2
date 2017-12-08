import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';

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
  groupMembers;
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

    addMoreMembersModal.onDidDismiss(selectedContacts => {
      console.log("Did dismiss.");
      console.log(selectedContacts);
      this.moreMembers = selectedContacts;
      console.log(this.moreMembers);
      console.log(this.moreMembers[0].name.givenName);
      
      this.groupMembers = [
        {
          displayName: this.currentUserInfo.displayName,
          uid: this.currentUID,
          admin: true,
          photoURL: this.currentUserInfo.photoURL
        }
      ]

      for (let i = 0; i < selectedContacts.length; i++) {
        if (selectedContacts[i].activeUser) {
          this.groupMembers[i+1] = {
            displayName: selectedContacts[i].name.givenName + " " + selectedContacts[i].name.familyName,
            uid: selectedContacts[i].uid,
            admin: false,
          }
        } else {
          this.groupMembers[i+1] = {
            displayName: selectedContacts[i].name.givenName + " " + selectedContacts[i].name.familyName,
            admin: false,
          }
        }

        if (selectedContacts[i].photos !== null) {
          this.groupMembers[i+1]["photoURL"] = selectedContacts[i].photos[0].value;          
        }

        console.log(this.groupMembers);       
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
      members: this.groupMembers,
    });
    this.navCtrl.pop();
  }

}
