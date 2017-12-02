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
  

  pushNewGroup(newGroupObject: object): void {
    const newGroupRef = this.groupsRef.push({});
    newGroupRef.set(newGroupObject);
  }

  getUserData(uid) {
    return new Promise (resolve => {this.afDatabase.object("/userProfile/" + uid).valueChanges().subscribe(data => {
      resolve(data);
    });
  })
  
 
}
}
