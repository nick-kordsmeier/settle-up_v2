import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

import { SettleUpDbProvider } from '../../providers/settle-up-db/settle-up-db';
import { NativeContactsProvider } from '../../providers/native-contacts/native-contacts';

@Component({
  selector: 'add-more-members-modal',
  templateUrl: 'add-more-members-modal.html'
})
export class AddMoreMembersModalComponent {
activeUsersData = [];
alreadySelected = [];
selectedContacts = [];
deSelectedContacts = [];
nativeContacts;
numberSelected = 0;
anyActiveUsers;
groupedContacts = [];
sortedNativeContacts;

  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private settleUpProvider: SettleUpDbProvider,
    private nativeContactsProvider: NativeContactsProvider,
  ) {  }

  ionViewDidLoad() {
    this.anyActiveUsers = 0;
    
    this.nativeContacts = [];
    for (let i = 0; i < this.nativeContactsProvider.nativeContactsList.length; i++) {
      this.nativeContacts.push(this.nativeContactsProvider.nativeContactsList[i]._objectInstance);
    }
  }



  ionViewDidEnter() {
    if (this.navParams.get("alreadySelected")) {
      this.alreadySelected = this.navParams.get("alreadySelected");
      this.numberSelected = this.alreadySelected.length;

      for (let i = 0; i < this.alreadySelected.length; i++) {
        this.alreadySelected[i].selected = true;
        this.selectedContacts.push(this.alreadySelected[i]);
      }
      console.log(this.selectedContacts);
    }

    this.settleUpProvider.usersRef.valueChanges().subscribe(data => {
      this.activeUsersData = data;

      for (let i = 0; i < this.nativeContacts.length; i++) {
        if (this.nativeContacts[i].emails) {
          loop2: for (let j = 0; j < this.nativeContacts[i].emails.length; j++) {
            let activeIndex = this.activeUsersData.findIndex(element => element["email"] === this.nativeContacts[i].emails[j].value);
            if (activeIndex >= 0) {
              this.anyActiveUsers++
              this.nativeContacts[i]["activeUser"] = true;
              this.nativeContacts[i]["uid"] = this.activeUsersData[activeIndex].uid;
              break loop2;
            } else {
              this.nativeContacts[i]["activeUser"] = false;
            }
          }
        } else {
          this.nativeContacts[i]["activeUser"] = false;
        }
      }
      this.sortedNativeContacts = this.nativeContacts.sort(this.sortByGivenName);
      console.log(this.sortedNativeContacts)
      
      this.groupedContacts = [];
      this.groupByGivenName(this.nativeContacts);
      console.log(this.groupedContacts);  

    });
    console.log(this.nativeContacts);
    console.log(this.selectedContacts);

  }

  addMember(contact) {
    if (!contact.selected) {
      this.selectedContacts.push(contact);
      contact.selected = true;
      this.numberSelected++;
      console.log(this.selectedContacts);
      console.log(this.nativeContacts);
    } else if (contact.selected) {
        contact.selected = false;
        this.numberSelected--
        this.selectedContacts.splice(this.selectedContacts.findIndex(o => o === contact), 1);

        for (let k = 0; k < this.alreadySelected.length; k++) {
          if ( contact === this.alreadySelected[k]) {
            this.deSelectedContacts.push(this.alreadySelected[k]);
          }
        }
        console.log(this.selectedContacts);
      }
  }

  onSave() {
    this.anyActiveUsers = 0;
    for (let i = 0; i < this.selectedContacts.length; i++) {
      let index = this.nativeContacts.findIndex(o => o === this.selectedContacts[i]);
      this.nativeContacts[index].selected = false;
    }
      this.viewCtrl.dismiss({selected: this.selectedContacts, deSelected: this.deSelectedContacts}).then(() => {
    });
  }

  onCancel() {
    for (let i = 0; i < this.selectedContacts.length; i++) {
      let index = this.nativeContacts.findIndex(o => o === this.selectedContacts[i]);
      this.nativeContacts[index].selected = false;
    }
    this.viewCtrl.dismiss();
  }

  sortByGivenName(obj1, obj2) {
    if (obj1.name.givenName < obj2.name.givenName)
      return -1;
    if (obj1.name.givenName > obj2.name.givenName)
      return 1;
    return 0;
  }

  groupByGivenName(sortedContactsArr) {
    let currentLetter = false;
    let currentContacts = [];
    let currentActiveCount = 0;

    sortedContactsArr.forEach((value, index) => {
 
      console.log(value.name.givenName.charAt(0))
      console.log(currentLetter);
      if (value.name.givenName.charAt(0) !== currentLetter) {
        currentLetter = value.name.givenName.charAt(0);
        console.log("currentLetter =")
        console.log(currentLetter);

        let newGroup = {
          letter: currentLetter,
          contacts: [],
          activeUsers: false,
          onlyActiveUsers: false
        };

        currentContacts = newGroup.contacts;
        console.log(currentContacts);
        this.groupedContacts.push(newGroup);
      }
      console.log(this.groupedContacts);

      currentContacts.push(value);
      console.log(currentContacts);
    });


    for (let i = 0; i < this.groupedContacts.length; i++) {
      currentActiveCount = 0;
      for (let j = 0; j < this.groupedContacts[i].contacts.length; j++) {
        console.log(this.groupedContacts[i].contacts[j].activeUser);
        if (this.groupedContacts[i].contacts[j].activeUser) {
          currentActiveCount++;
        }
      }
      if (currentActiveCount > 0) {
        this.groupedContacts[i].activeUsers = true;
      }
      if (currentActiveCount === this.groupedContacts[i].contacts.length) {
        this.groupedContacts[i].onlyActiveUsers = true;
      }
    }
  }
}