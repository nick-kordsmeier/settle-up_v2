import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable'
import { updateDate } from 'ionic-angular/util/datetime-util';

@Injectable()
export class SettleUpDbProvider {
  groupsRef: AngularFireList<any>;
  usersRef: AngularFireList<any>;
  inactiveUsersRef: AngularFireList<any>;


  constructor(
    public afDatabase: AngularFireDatabase
  ) {
    this.groupsRef = afDatabase.list("/Groups");
    this.usersRef = afDatabase.list("/userProfile");
    this.inactiveUsersRef = afDatabase.list("/inactiveUsers");
    }
  

  pushNewGroup(newGroupObject): void {
    const newGroupRef = this.groupsRef.push({});
    console.log("pushNewGroup() start")
    console.log(newGroupObject);

    for (let i = 0; i < newGroupObject.members.length; i++) {
      if (!newGroupObject.members[i].activeUser) {
        const newInactiveUserRef = this.inactiveUsersRef.push({});
        newInactiveUserRef.set(newGroupObject.members[i]);
        newInactiveUserRef.child("uid").set(newInactiveUserRef.key);
        newGroupObject.members[i]["uid"] = newInactiveUserRef.key;
      }
    }
    console.log(newGroupObject);

    for (let i = 0; i < newGroupObject.members.length; i++) {
      if (newGroupObject.members[i].activeUser) {
        const ref = this.afDatabase.list("/userProfile/" + newGroupObject.members[i].uid + "/groups").push({key: newGroupRef.key, groupName: newGroupObject.groupName});
        for (let j = 0; j < newGroupObject.members.length; j++) {
          if (newGroupObject.members[j].uid !== newGroupObject.members[i].uid) {
            if (!this.checkConnectionStatus(true, newGroupObject.members[i].uid, newGroupObject.members[j].uid)) {
              this.afDatabase.object("/userProfile/" + newGroupObject.members[i].uid + "/connections").update({[newGroupObject.members[j].uid]: newGroupObject.members[j]});
              this.afDatabase.object("/userProfile/" + newGroupObject.members[i].uid + "/connections/" + newGroupObject.members[j].uid + "/balance").update({value: 0});
            }
          }
        }
      } else {
        this.afDatabase.list("/inactiveUsers/" + newGroupObject.members[i].uid + "/groups").push({key: newGroupRef.key, groupName: newGroupObject.groupName}); 
        for (let j = 0; j < newGroupObject.members.length; j++) {
          if (newGroupObject.members[j].uid !== newGroupObject.members[i].uid) {
            if (!this.checkConnectionStatus(false, newGroupObject.members[i].uid, newGroupObject.members[j].uid)) {
              this.afDatabase.object("/inactiveUsers/" + newGroupObject.members[i].uid + "/connections").update({[newGroupObject.members[j].uid]: newGroupObject.members[j]});
              this.afDatabase.object("/inactiveUsers/" + newGroupObject.members[i].uid + "/connections/" + newGroupObject.members[j].uid + "/balance").update({value: 0});
            }
          }
        }
      }
    }

    console.log(newGroupObject);

    // Initialize the variables that will store who owes who what.
    console.log("Outer for loop starts")
    console.log(newGroupObject.members.length);
    for (let i = 0; i < newGroupObject.members.length; i++) {
      console.log("Inner for loop starts")
      console.log(newGroupObject.members);
      for (let j = 0; j < newGroupObject.members.length; j++) {
        console.log(newGroupObject.members[i].uid)

        if (newGroupObject.members[i].uid !== newGroupObject.members[j].uid) {
          newGroupObject.members[i][`${newGroupObject.members[i].uid}-${newGroupObject.members[j].uid}`] = 0;
        }
      }
    }
    console.log("this.groupMembers after loops = ");
    console.log(newGroupObject.members);
    console.log(newGroupObject);
    
    newGroupRef.set(newGroupObject);
    newGroupRef.child("key").set(newGroupRef.key);
    console.log("pushNewGroup() end")
    
  }

  pushNewPurchase(groupKey, newPurchaseObject, numPurchases, uid, groupMembers): void {
    // Push new purchase object data to firebase.
    const newPurchaseRef = this.afDatabase.list("/Groups/" + groupKey + "/purchases").push({});
    newPurchaseRef.set(newPurchaseObject);
    newPurchaseRef.child("key").set(newPurchaseRef.key);

    // Add to the group numPurchases variable.
    this.afDatabase.object("/Groups/" + groupKey + "/numPurchases").set(numPurchases);

    // Keep track of most recent purchase.
    this.afDatabase.object("/Groups/" + groupKey + "/mostRecentPurchase").set(newPurchaseObject);
    console.log("running pushNewPurchase()")

  }

  updateBalances(groupKey, updatedGroupMembers, purchasePrice, numMembers, currentUID) {
    console.log("updateBalances");
    this.afDatabase.object("/Groups/" + groupKey + "/members").set(updatedGroupMembers);
    console.log(updatedGroupMembers);
    
    for (let i = 0; i < numMembers; i ++) {
      for (let j = 0; j < numMembers; j++) {
        if (updatedGroupMembers[i].uid === currentUID) {
          if (updatedGroupMembers[i].uid !== updatedGroupMembers[j].uid) {
            // console.log("Before")
            // console.log(updatedGroupMembers[i][`${updatedGroupMembers[i].uid}-${updatedGroupMembers[j].uid}`]);
            if (updatedGroupMembers[i].activeUser) {
              this.getCurrentUIDConnectionBalance(true, updatedGroupMembers[i].uid, updatedGroupMembers[j].uid).then( data => {
                let currentBalanceObj = data
                let currentBalance = currentBalanceObj["value"];
                console.log(currentBalanceObj);
                console.log(currentBalanceObj["value"]);
                console.log("update balance");
                currentBalance += purchasePrice / numMembers;
                this.afDatabase.object("/userProfile/" + updatedGroupMembers[i].uid + "/connections/" + updatedGroupMembers[j].uid + "/balance").set({value: currentBalance});
              });
            } else {
              this.getCurrentUIDConnectionBalance(false, updatedGroupMembers[i].uid, updatedGroupMembers[j].uid).then( data => {
                let currentBalanceObj = data
                let currentBalance = currentBalanceObj["value"];
                console.log(currentBalanceObj);
                console.log(currentBalanceObj["value"]);
                console.log("update balance");
                currentBalance += purchasePrice / numMembers;
                this.afDatabase.object("/inactiveUsers/" + updatedGroupMembers[i].uid + "/connections/" + updatedGroupMembers[j].uid + "/balance").set({value: currentBalance});
              });
            }
            // updatedGroupMembers[i][`${updatedGroupMembers[i].uid}-${updatedGroupMembers[j].uid}`] += (purchasePrice/numMembers)
            // console.log("After")
            // console.log(updatedGroupMembers[i][`${updatedGroupMembers[i].uid}-${updatedGroupMembers[j].uid}`]);
          }
        }
      }
      if (updatedGroupMembers[i].uid !== currentUID) {
        if (updatedGroupMembers[i].activeUser) {
          this.getCurrentUIDConnectionBalance(true, updatedGroupMembers[i].uid, currentUID).then( data => {
            let currentBalanceObj = data
            let currentBalance = currentBalanceObj["value"];
            console.log(currentBalanceObj);
            console.log(currentBalanceObj["value"]);
            console.log("update balance");
            currentBalance -= purchasePrice / numMembers;
            this.afDatabase.object("/userProfile/" + updatedGroupMembers[i].uid + "/connections/" + currentUID + "/balance").set({value: currentBalance});
          });
        } else {
          this.getCurrentUIDConnectionBalance(false, updatedGroupMembers[i].uid, currentUID).then( data => {
            let currentBalanceObj = data
            let currentBalance = currentBalanceObj["value"];
            console.log(currentBalanceObj);
            console.log(currentBalanceObj["value"]);
            console.log("update balance");
            currentBalance -= purchasePrice / numMembers;
            this.afDatabase.object("/inactiveUsers/" + updatedGroupMembers[i].uid + "/connections/" + currentUID + "/balance").set({value: currentBalance});
          });
        }
        // updatedGroupMembers[i][`${updatedGroupMembers[i].uid}-${currentUID}`] -= (purchasePrice/numMembers)
        console.log("If subtracting");
        // console.log(updatedGroupMembers[i][`${updatedGroupMembers[i].uid}-${currentUID}`]);
      }
    }




  }

  checkConnectionStatus(active, testUID, compareUID) {
    if (active) {
      this.afDatabase.object("/userProfile/" + testUID + "/connections/" + compareUID).valueChanges().subscribe(data => {
        if (data) {
          return true;          
        } else return false;
      });

    } else {
      this.afDatabase.object("/inactiveUsers/" + testUID + "/connections/" + compareUID).valueChanges().subscribe(data => {
        if (data) {
          return true;          
        } else return false;
      });
    }
  }

  getCurrentUIDConnectionBalance(activeUser, testUID, compareUID) {
    if (activeUser) {
      return new Promise (resolve => {this.afDatabase.object("/userProfile/" + testUID + "/connections/" + compareUID + "/balance").valueChanges().subscribe(data => {
        resolve(data);
      });
    });
    } else {
      return new Promise (resolve => {this.afDatabase.object("/inactiveUsers/" + testUID + "/connections/" + compareUID + "/balance").valueChanges().subscribe(data => {
        resolve(data);
      });
    });
    }

  }

  getGroupDetails(key) {
    return new Promise (resolve => {this.afDatabase.object("/Groups/" + key).valueChanges().subscribe(data => {
      resolve(data);
    });
  });
  }

  // getPurchaseDetails(groupKey, purchaseKey) {
  //   return new Promise (resolve => {this.afDatabase.object("/Groups/" + groupKey + "/purchases/" + purchaseKey).valueChanges().subscribe(data => {
  //     resolve(data);
  //   });
  // });
  // }


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
