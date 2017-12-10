import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable'

@Injectable()
export class SettleUpDbProvider {
  groupsRef: AngularFireList<any>;
  usersRef: AngularFireList<any>;


  constructor(
    public afDatabase: AngularFireDatabase
  ) {
    this.groupsRef = afDatabase.list("/Groups");
    this.usersRef = afDatabase.list("/userProfile");
    }
  

  pushNewGroup(newGroupObject): void {
    const newGroupRef = this.groupsRef.push({});
    newGroupRef.set(newGroupObject);
    newGroupRef.child("key").set(newGroupRef.key);

    for (let i = 0; i < newGroupObject.members.length; i++) {
      if (newGroupObject.members[i].uid) {
        this.afDatabase.list("/userProfile/" + newGroupObject.members[i].uid + "/groups").push({key: newGroupRef.key, groupName: newGroupObject.groupName});
      }
    }
  }

  pushNewPurchase(groupKey, newPurchaseObject, numPurchases, uid, groupMembers): void {
    // Push new purchase object data to firebase.
    const newPurchaseRef = this.afDatabase.list("/Groups/" + groupKey + "/Purchases").push({});
    newPurchaseRef.set(newPurchaseObject);
    newPurchaseRef.child("key").set(newPurchaseRef.key);

    // Add to the group numPurchases variable.
    this.afDatabase.object("/Groups/" + groupKey + "/numPurchases").set(numPurchases);

  }

  updateBalances(groupKey, updatedGroupMembers) {
    this.afDatabase.object("/Groups/" + groupKey + "/members").set(updatedGroupMembers);
  }

  getGroupDetails(key) {
    return new Promise (resolve => {this.afDatabase.object("/Groups/" + key).valueChanges().subscribe(data => {
      resolve(data);
    });
  });
  }

  getUserData(uid) {
    return new Promise (resolve => {this.afDatabase.object("/userProfile/" + uid).valueChanges().subscribe(data => {
      resolve(data);
    });
  });
}

getActiveUserGroup(uid) {
  return new Promise (resolve => {this.afDatabase.object("/userProfile/" + uid + "/groups").valueChanges().subscribe(data => {
    resolve(data);
  });
});

}

}
