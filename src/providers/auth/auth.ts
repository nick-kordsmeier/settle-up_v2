import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class AuthProvider {
userInfo: Object;
  constructor() {
   }

  getUserInfo(uid) {
    return firebase.database().ref('/userProfile/' + uid).once('value').then( snapshot => {
      this.userInfo = snapshot.val();
    });
  }

  getUID() {
    return firebase.auth().currentUser.uid;
  }
 
  loginUser(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  signupUser(email: string, password: string, firstName: string, lastName: string): Promise<any> {
    return firebase.auth().createUserWithEmailAndPassword(email, password).then(
      newUser => {
      firebase.auth().currentUser.updateProfile({ displayName: firstName + " " + lastName, photoURL: null })
      firebase.database().ref('/userProfile').child(newUser.uid).set({
        uid: newUser.uid,
        email: email,
        firstName: firstName,
        lastName: lastName,
        displayName: firstName + " " + lastName,
        photoURL: null,
      });
    })
  }

  resetPassword(email: string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  logoutUser(): Promise<void> {
    return firebase.auth().signOut();
  }

  signInWithFacebook() {
    let provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  }

  checkRedirect() {
    firebase.auth().getRedirectResult().then( result => {
      if (!this.getUserInfo(result.user.uid)) {
        let userId = result.user.uid;
        let displayName = result.user.displayName.split(" ");
        firebase.database().ref('/userProfile').child(userId).set({
          email: result.user.email,
          firstName: displayName[0],
          lastName: displayName[1],
          photoURL: result.user.photoURL,
        });
      } else {
        console.log("This is not user's first login.")
      }
    });

  }

}
