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
searchUsers: Object;
searchUsersNames: Array<string> = [];
displaySearchNames: Array<string>;
selectedNames: Array<string> = [];
nativeContacts;

  constructor(
    public viewCtrl: ViewController,
    private settleUpProvider: SettleUpDbProvider,
    private nativeContactsProvider: NativeContactsProvider
  ) {
  this.settleUpProvider.usersRef.valueChanges().subscribe(data => {
    this.searchUsers = data
    for (let i = 0; i < data.length; i++) {
      this.searchUsersNames.push(data[i].firstName);
    }
    
      this.nativeContacts =  nativeContactsProvider.nativeContactsList;      


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

  addMember(displaySearchName) {
    this.selectedNames.push(displaySearchName);
    console.log(this.selectedNames);
  }

  onClose() {
    this.viewCtrl.dismiss(this.selectedNames).then(() => {
      this.selectedNames = [];
    });
  }

}
