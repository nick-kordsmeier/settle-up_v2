import { Injectable } from '@angular/core';
import * as firebase from 'firebase'

@Injectable()
export class AuthProvider {

  constructor() { }
  

  loginUser(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  signupUser(email: string, password: string, firstName: string, lastName: string): Promise<any> {
    return firebase.auth().createUserWithEmailAndPassword(email, password).then(
      newUser => {
      firebase.auth().currentUser.updateProfile({ displayName: firstName + " " + lastName, photoURL: null })
      firebase.database().ref('/userProfile').child(newUser.uid).set({
        email: email,
        firstName: firstName,
        lastName: lastName,
        photoURL: null
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
    return firebase.auth().getRedirectResult().then( result => {
      console.log(result.user);
      // let displayName = result.user.displayName.split(" ");
      // firebase.database().ref('/userProfile').child(result.uid).set({
      //   email: result.user.email,
      //   firstName: displayName[0],
      //   lastName: displayName[1],
      //   photoURL: result.user.photoURL
      });
  

      //   if (result.credential) {
    //     // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    //     var token = result.credential.accessToken;
    //     console.log(token)
    //     // ...
    //   }
    //   // The signed-in user info.
    //   var user = result.user;
    //   console.log(user)
    // }).catch(function(error) {
    //   // Handle Errors here.
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   // The email of the user's account used.
    //   var email = error.email;
    //   console.log(email)
    //   // The firebase.auth.AuthCredential type that was used.
    //   var credential = error.credential;
    //   // ...
    // });
  }

}
