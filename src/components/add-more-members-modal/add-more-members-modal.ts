import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

import { SettleUpDbProvider } from '../../providers/settle-up-db/settle-up-db';
import { NativeContactsProvider } from '../../providers/native-contacts/native-contacts';

import { Observable } from 'rxjs/Observable';

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

  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private settleUpProvider: SettleUpDbProvider,
    private nativeContactsProvider: NativeContactsProvider,
  ) {
    
    if (navParams.get("alreadySelected")) {
      this.alreadySelected = navParams.get("alreadySelected");
      this.numberSelected = this.alreadySelected.length;

      for (let i = 0; i < this.alreadySelected.length; i++) {
        this.alreadySelected[i].selected = true;
        this.selectedContacts.push(this.alreadySelected[i]);
      }
      console.log(this.selectedContacts);
      console.log("Already selected function works");
    }

    this.settleUpProvider.usersRef.valueChanges().subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        this.activeUsersData.push(data[i]);
      }
      this.nativeContacts = [];    
      for (let i = 0; i < this.nativeContactsProvider.nativeContactsList.length; i++) {

        this.nativeContacts.push(this.nativeContactsProvider.nativeContactsList[i]._objectInstance);
      }    

      for (let i = 0; i < this.nativeContacts.length; i++) {
        if (this.nativeContacts[i].emails) {
          for (let j = 0; j < this.nativeContacts[i].emails.length; j++) {
            for (let k = 0; k < this.activeUsersData.length; k++) {
              if (this.nativeContacts[i].emails[j].value === this.activeUsersData[k].email) {
                this.nativeContacts[i]["activeUser"] = true;
                this.nativeContacts[i]["uid"] = this.activeUsersData[k].uid;
                break;
              } else {
                this.nativeContacts[i]["activeUser"] = false;
              }
            }
          }
        } else {
          this.nativeContacts[i]["activeUser"] = false;        
        }
      }
      console.log(this.nativeContacts);
    });
  }

  addMember(contact) {
    if (!contact.selected) {
      this.selectedContacts.push(contact);
      for (let i = 0; i < this.nativeContacts.length; i++) {
        if (contact === this.nativeContacts[i]) {
          this.nativeContacts[i]["selected"] = true;
          this.numberSelected++
        }
      }
      console.log(this.selectedContacts);
    } else if (contact.selected) {
        for (let i = 0; i < this.nativeContacts.length; i++) {
          if (contact === this.nativeContacts[i]) {
            this.nativeContacts[i]["selected"] = false;
            this.numberSelected--
          }
        }
        for (let j = 0; j < this.selectedContacts.length; j++) {
          if (contact === this.selectedContacts[j]) {
            this.selectedContacts.splice(j, 1);
          }
        }

        for (let k = 0; k < this.alreadySelected.length; k++) {
          if ( contact === this.alreadySelected[k]) {
            this.deSelectedContacts.push(this.alreadySelected[k]);
          }
        }
        console.log(this.selectedContacts);
      }
  }

  onSave() {
    for (let i = 0; i < this.nativeContacts.length; i++) {
        this.nativeContacts[i]["selected"] = false;
        this.numberSelected = 0;
      }
    this.viewCtrl.dismiss({selected: this.selectedContacts, deSelected: this.deSelectedContacts}).then(() => {
      this.selectedContacts = [];
    });
  }

  onCancel() {
    for (let i = 0; i < this.nativeContacts.length; i++) {
      this.nativeContacts[i]["selected"] = false;
      this.numberSelected = 0;
    }
    this.viewCtrl.dismiss();
  }

}

      // this.nativeContacts[i].push({
      //   "givenName": nativeContactsProvider.nativeContactsList[i].givenName,
      //   "familyName": nativeContactsProvider.nativeContactsList[i].familyName,
      //   "photos": nativeContactsProvider.nativeContactsList[i].photos[0].value
      // });



// searchUsersNames: Array<string> = [];
// displaySearchNames: Array<string>;

  // getUsers(ev: any) {
  //   this.displaySearchNames = this.searchUsersNames;
  //   console.log(this.displaySearchNames)

  //   let val = ev.target.value;

  //   if (val && val.trim() !== '') {
  //     this.displaySearchNames = this.displaySearchNames.filter(user => {
  //       return user.toLowerCase().includes(val.toLowerCase());
  //     });
  //   }    
  // }