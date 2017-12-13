import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

import { SettleUpDbProvider } from '../../providers/settle-up-db/settle-up-db';
import { NativeContactsProvider } from '../../providers/native-contacts/native-contacts';

import { Observable } from 'rxjs/Observable';


// function searchArray (searchValue, searchProperty, searchArray) {
//   for (let i = 0; i < searchArray.length; i++) {
//     if (searchArray[i][searchProperty] === searchValue) return i;
//   }
// }


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
rawNativeContacts = [];

  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private settleUpProvider: SettleUpDbProvider,
    private nativeContactsProvider: NativeContactsProvider,
  ) {
    // if (navParams.get("alreadySelected")) {
    //   this.alreadySelected = navParams.get("alreadySelected");
    //   this.numberSelected = this.alreadySelected.length;

    //   for (let i = 0; i < this.alreadySelected.length; i++) {
    //     this.alreadySelected[i].selected = true;
    //     this.selectedContacts.push(this.alreadySelected[i]);
    //   }
    //   console.log(this.selectedContacts);
    //   console.log("Already selected function works");
    // }

    // this.settleUpProvider.usersRef.valueChanges().subscribe(data => {
    //   this.activeUsersData = data;
    //   // for (let i = 0; i < data.length; i++) {
    //   //   this.activeUsersData.push(data[i]);
    //   // }
    //   this.nativeContacts = [];
    //   for (let i = 0; i < this.nativeContactsProvider.nativeContactsList.length; i++) {
    //     this.nativeContacts.push(this.nativeContactsProvider.nativeContactsList[i]._objectInstance);
    //   }

    //   for (let i = 0; i < this.nativeContacts.length; i++) {
    //     if (this.nativeContacts[i].emails) {
    //       loop2: for (let j = 0; j < this.nativeContacts[i].emails.length; j++) {
    //         let activeIndex = this.activeUsersData.findIndex(element => element["email"] === this.nativeContacts[i].emails[j].value);
    //         if (activeIndex >= 0) {
    //           this.nativeContacts[i]["activeUser"] = true;
    //           this.nativeContacts[i]["uid"] = this.activeUsersData[activeIndex].uid;
    //           break loop2;
    //         } else {
    //           this.nativeContacts[i]["activeUser"] = false;
    //         }
    //       }
    //     } else {
    //       this.nativeContacts[i]["activeUser"] = false;
    //     }
    //   }
      
    //   // for (let i = 0; i < this.nativeContacts.length; i++) {
    //   //   if (this.nativeContacts[i].emails) {
    //   //     for (let j = 0; j < this.nativeContacts[i].emails.length; j++) {
    //   //       for (let k = 0; k < this.activeUsersData.length; k++) {
    //   //         if (this.nativeContacts[i].emails[j].value === this.activeUsersData[k].email) {
    //   //           this.nativeContacts[i]["activeUser"] = true;
    //   //           this.nativeContacts[i]["uid"] = this.activeUsersData[k].uid;
    //   //           break;
    //   //         } else {
    //   //           this.nativeContacts[i]["activeUser"] = false;
    //   //         }
    //   //       }
    //   //     }
    //   //   } else {
    //   //     this.nativeContacts[i]["activeUser"] = false;        
    //   //   }
    //   // }
    // });
    // console.log(this.nativeContacts);
    // console.log(this.selectedContacts);
  }

  ionViewDidLoad() {
    this.anyActiveUsers = 0;
    
    this.rawNativeContacts = [];
    for (let i = 0; i < this.nativeContactsProvider.nativeContactsList.length; i++) {
      this.rawNativeContacts.push(this.nativeContactsProvider.nativeContactsList[i]._objectInstance);
    }

    this.nativeContacts = this.rawNativeContacts.sort(this.compare);
    console.log(this.nativeContacts)

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

  compare(obj1, obj2) {
    if (obj1.name.givenName < obj2.name.givenName)
      return -1;
    if (obj1.name.givenName > obj2.name.givenName)
      return 1;
    return 0;
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