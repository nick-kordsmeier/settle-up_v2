import { Injectable } from '@angular/core';
import * as firebase from 'firebase'


@Injectable()
export class SettleUpDbProvider {

  constructor() {  }

  pushNewGroup(newGroupObject: object) {
    let newGroupKey = firebase.database().ref('/Groups').push().key;
    firebase.database().ref('/Groups').child(newGroupKey).set(newGroupObject);
  }

}
