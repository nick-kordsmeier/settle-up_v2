import { Component } from '@angular/core';
import { SettleUpDbProvider } from '../../providers/settle-up-db/settle-up-db';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'add-more-members-modal',
  templateUrl: 'add-more-members-modal.html'
})
export class AddMoreMembersModalComponent {
users;
usersNames = [];
displayNames;

  constructor(private settleUpProvider: SettleUpDbProvider) {
  this.settleUpProvider.usersRef.valueChanges().subscribe(data => {
    this.users = data
    for (let i = 0; i < data.length; i++) {
      this.usersNames.push(data[i].firstName);
    }
  });

}

  getUsers(ev: any) {
    this.displayNames = this.usersNames;
    console.log(this.displayNames)


    let val = ev.target.value;

    if (val && val.trim() !== '') {
      this.displayNames = this.displayNames.filter(user => {
        return user.toLowerCase().includes(val.toLowerCase());
      });
    }
    

  }

}
