import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EmailValidator } from '../../validators/email';

import { AuthProvider } from '../../providers/auth/auth';
import { TabsPage } from '../../pages/tabs/tabs';
import { SignupPage } from '../../pages/signup/signup';
import { ResetPasswordPage } from '../../pages/reset-password/reset-password';

// @IonicPage({
//   name: 'LoginPage'
// })
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
public loginForm: FormGroup;
public loading: Loading;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public formBuilder: FormBuilder
  ) {
    this.loginForm = formBuilder.group({
      email: ['',
      Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['',
      Validators.compose([Validators.minLength(6), Validators.required])]
    });
   }

   loginUser(): void {
     if (!this.loginForm.valid) {
       console.log(this.loginForm.value);
     } else {
       this.authProvider.loginUser(this.loginForm.value.email, this.loginForm.value.password)
       .then( authData => {
         this.loading.dismiss().then( () => {
           this.navCtrl.setRoot(TabsPage);
         });
       }, error => {
         this.loading.dismiss().then( () => {
           let alert = this.alertCtrl.create({
             message: error.message,
             buttons: [
               {
                 text: "Ok",
                 role: "cancel"
               }
             ]
           });
           alert.present();
         }).catch(err => { console.error(err) });
       }).catch(err => { console.error(err) });
       this.loading = this.loadingCtrl.create();
       this.loading.present();
     }
   }

   goToSignup(): void {
     this.navCtrl.push(SignupPage);
   }

   goToResetPassword(): void {
     this.navCtrl.push(ResetPasswordPage);
   }

   signInWithFacebook() {
     this.authProvider.signInWithFacebook();
   }

}
