import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

import { SettleUpDbProvider } from '../../providers/settle-up-db/settle-up-db';
import { NativeContactsProvider } from '../../providers/native-contacts/native-contacts';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'add-more-members-modal',
  templateUrl: 'add-more-members-modal.html'
})

export class AddMoreMembersModalComponent {
activeUsersData = [];
// searchUsersNames: Array<string> = [];
// displaySearchNames: Array<string>;
selectedContacts = [];
nativeContacts;
numberSelected = 0;

  constructor(
    public viewCtrl: ViewController,
    private settleUpProvider: SettleUpDbProvider,
    private nativeContactsProvider: NativeContactsProvider,
  ) {

  this.settleUpProvider.usersRef.valueChanges().subscribe(data => {
    for (let i = 0; i < data.length; i++) {
      this.activeUsersData.push(data[i]);
    }
    //console.log(this.activeUsersData);
    this.nativeContacts = [];    
    for (let i = 0; i < this.nativeContactsProvider.nativeContactsList.length; i++) {
      // this.nativeContacts[i].push({
      //   "givenName": nativeContactsProvider.nativeContactsList[i].givenName,
      //   "familyName": nativeContactsProvider.nativeContactsList[i].familyName,
      //   "photos": nativeContactsProvider.nativeContactsList[i].photos[0].value
      // });

      this.nativeContacts.push(this.nativeContactsProvider.nativeContactsList[i]._objectInstance);
    }    

    for (let i = 0; i < this.nativeContacts.length; i++) {
      if (this.nativeContacts[i].emails) {
        //console.log(this.nativeContacts[i].emails);
        for (let j = 0; j < this.nativeContacts[i].emails.length; j++) {
          //console.log(this.nativeContacts[i].emails[j].value)
          for (let k = 0; k < this.activeUsersData.length; k++) {
            //console.log(this.activeUsersData[k].email)
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
        console.log(this.selectedContacts);
      }
  }

  onSave() {
    for (let i = 0; i < this.nativeContacts.length; i++) {
        this.nativeContacts[i]["selected"] = false;
        this.numberSelected = 0;
      }
    this.viewCtrl.dismiss(this.selectedContacts).then(() => {
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
