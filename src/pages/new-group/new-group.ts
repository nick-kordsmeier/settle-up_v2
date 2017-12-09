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
  currentUserInfo;
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
    this.groupMembers = [];
    this.moreMembers = [];
  }

  addMoreMembers() {
    console.log("Add members");
    let addMoreMembersModal = this.modalCtrl.create(AddMoreMembersModalComponent, {alreadySelected: this.moreMembers});
    addMoreMembersModal.present();

    addMoreMembersModal.onDidDismiss(data => {
      // Check if data is returned with an IF statment.
      if (data) {
        // Parse data returned from the modal.
        let selectedContacts = data.selected;
        let deSelectedContacts = data.deSelected;
        console.log(selectedContacts);
        console.log(deSelectedContacts);
        console.log("Did dismiss.");
        
        console.log(this.moreMembers);
        console.log(selectedContacts);
        // If moreMembers is greater than 0, then some members have already been selected and we need to check which selected contacts are already in the moreMembers array.
        // If a selected contact is already in the moreMembers array, then we don't need to do anything. If not, then we push the new selected contact into the moreMembers array.
        if (this.moreMembers.length > 0) {
          for (let i = 0; i < selectedContacts.length; i++) {
            let existing = 0;
            for (let j = 0; j < this.moreMembers.length; j++) {
              if ((selectedContacts[i].name.givenName + " " + selectedContacts[i].name.familyName) === (this.moreMembers[j].name.givenName + " " + this.moreMembers[j].name.familyName)) {
                console.log(selectedContacts[i].name.givenName + " " + selectedContacts[i].name.familyName + "was already in the moreMembers array");
                existing++;
              } 
            }
            if (existing == 0) this.moreMembers.push(selectedContacts[i]);
          }
          console.log(this.moreMembers);
          
          // If a contact was previously included in the moreMembers array, but was deselected, loop through the deselected contacts array returned from the modal and remove any matching contacts from moreMembers[].
          for (let k = 0; k < deSelectedContacts.length; k++) {
            for (let l = 0; l < this.moreMembers.length; l++) {
              if ((deSelectedContacts[k].name.givenName + " " + deSelectedContacts[k].name.familyName) === (this.moreMembers[l].name.givenName + " " + this.moreMembers[l].name.familyName)) {
                console.log(deSelectedContacts[k].name.givenName + " " + deSelectedContacts[k].name.familyName + "was deselected");
                this.moreMembers.splice(l, 1);
              } 
            }
          }

        // If the moreMembers array is empty, then we can simply set it equal to the returned selectedContacts array.
        } else {
          this.moreMembers = selectedContacts;
          console.log(this.moreMembers);
        }

        // Initialize groupMembers array with admin credentials.
        this.groupMembers = [
          {
            displayName: this.currentUserInfo.displayName,
            uid: this.currentUID,
            admin: true,
            photoURL: this.currentUserInfo.photoURL
          }
        ]
        
        // Loop through the selected contacts and push the data into the groupMembers array to be sent to Firebase when the new group is created.
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

          // Pushing contact photo paths if they exist. These will only work on native device.
          if (selectedContacts[i].photos !== null) {
            this.groupMembers[i+1]["photoURL"] = selectedContacts[i].photos[0].value;          
          }

          console.log(this.groupMembers);
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
      members: this.groupMembers,
    });
    this.navCtrl.pop();
  }

}
