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
  groupIDCounter = 0;

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
        
        // Loop through the selected contacts and push the data into the groupMembers array to be sent to Firebase when the new group is created.
        console.log("selectedContacts Length = ");
        console.log(selectedContacts.length);
        // Initialize groupMembers array with admin credentials.
        let currentUserPhotoURL = null;
        if (this.currentUserInfo.photoURL) {currentUserPhotoURL = this.currentUserInfo.photoURL};

        this.groupMembers = [
          {
            displayName: this.currentUserInfo.displayName,
            uid: this.currentUID,
            admin: true,
            photoURL: currentUserPhotoURL,
            groupID: 0,
            email: this.currentUserInfo.email,
            activeUser: true
          }
        ]

        for (let i = 0; i < selectedContacts.length; i++) {

              this.settleUpProvider.getUserData(selectedContacts[i].uid).then( UserData => {
                console.log(selectedContacts[i].activeUser);
                console.log("Active user data returned from promise");
                console.log(UserData)
                let selectedActiveUser = UserData;
                console.log("Selected Active User Data in variable");
                console.log(selectedActiveUser);
          
          this.addToGroupMembersArray(selectedContacts[i], selectedActiveUser).then( MemberData => {
                    // console.log("selected contacts = ");
                    // console.log(selectedContacts);
                    let returnedGroupMembersArr = MemberData;
                    console.log("Data returned from addToGroupMembersArray() = ");
                    console.log(MemberData);
                    console.log("returnedGroupMemberArr = ");
                    console.log(returnedGroupMembersArr);
            
                    // for (let i = 0; i < returnedGroupMembersArr.length; i++)
                    console.log("this.groupMembers before = ");
                    console.log(this.groupMembers);
            
                      this.groupMembers.push(MemberData[0]);
            
                      console.log("this.groupMembers after push = ");
                      console.log(this.groupMembers);
                      
            
                    // // Initialize the variables that will store who owes who what.
                    // console.log("Outer for loop starts")
                    // console.log(this.groupMembers.length);
                    // for (let i = 0; i < this.groupMembers.length; i++) {
                    //   console.log("Inner for loop starts")
                    //   console.log(this.groupMembers);
                    //   for (let j = 0; j < this.groupMembers.length; j++) {
                    //     console.log(this.groupMembers[i].groupID)
            
                    //     if (this.groupMembers[i].groupID !== j) {
                    //       this.groupMembers[i][`${i}-${j}`] = 0;
                    //     }
                    //   }
                    // }
                    // console.log("this.groupMembers after loops = ");
                    // console.log(this.groupMembers);
                    }).catch(err => { console.error(err) });;
                  }).catch(err => { console.error(err) });;



        // for (let i = 0; i < selectedContacts.length; i++) {
        //   if (selectedContacts[i].activeUser) {
        //     let selectedActiveUser;
        //     this.settleUpProvider.getUserData(selectedContacts[i].uid).then( data => {              
        //       selectedActiveUser = data;
        //       console.log(selectedActiveUser);

        //     this.groupMembers[i+1] = {
        //       displayName: selectedContacts[i].name.givenName + " " + selectedContacts[i].name.familyName,
        //       uid: selectedContacts[i].uid,
        //       admin: false,
        //       photoURL: selectedActiveUser.photoURL,
        //       groupID: i + 1
        //     }
        //     });            

        //   } else {
        //     this.groupMembers[i+1] = {
        //       displayName: selectedContacts[i].name.givenName + " " + selectedContacts[i].name.familyName,
        //       admin: false,
        //       groupID: i + 1
        //     }
        //   }
        //   console.log(this.groupMembers);
        // }



        
        // console.log(this.moreMembers);
      }
    }
    });    
  }
  
addToGroupMembersArray(selectedContact, selectedActiveUser) {
  let groupMembers = []; // Return this new variable to be pushed into this.groupMembers when promise is fulfilled.

        if (selectedActiveUser) {
          let selectedActiveUserPhotoURL = null;
          if (selectedActiveUser.photoURL) {selectedActiveUserPhotoURL = selectedActiveUser.photoURL};
          this.groupIDCounter++ // Add one for each additional selected user.
          console.log("Group ID Counter")
          console.log(this.groupIDCounter);

          groupMembers.push({
            displayName: selectedContact.name.givenName + " " + selectedContact.name.familyName,
            uid: selectedContact.uid,
            admin: false,
            photoURL: selectedActiveUserPhotoURL,
            groupID: this.groupIDCounter,
            email: selectedActiveUser.email,
            activeUser: true
          })
      
          console.log("groupMembers within if activeuser loop")
          console.log(groupMembers);
        } else {
          this.groupIDCounter++ // Add one for each additional selected user.          
          groupMembers.push({
            displayName: selectedContact.name.givenName + " " + selectedContact.name.familyName,
            admin: false,
            groupID: this.groupIDCounter,
            activeUser: false
          })
          console.log("groupMembers within non-active contact if loop")
          console.log(groupMembers);      
        }
        return new Promise (resolve => {
          resolve(groupMembers);
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
      numPurchases: 0
    });
    this.navCtrl.pop();
  }

}
