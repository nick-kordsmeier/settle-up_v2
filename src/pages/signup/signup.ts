import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EmailValidator } from '../../validators/email';

import { AuthProvider } from '../../providers/auth/auth';
import { TabsPage } from '../../pages/tabs/tabs';

// @IonicPage({
//   name: 'SignupPage'
// })
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  public signupForm: FormGroup;
  public loading: Loading;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public authProvider: AuthProvider,
    public formBuilder: FormBuilder, 
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController
  ) {
    this.signupForm = formBuilder.group({
      firstName: ['', 
      Validators.compose([Validators.minLength(1), Validators.required])],
      lastName: ['', 
      Validators.compose([Validators.minLength(1), Validators.required])],
      email: ['', 
        Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', 
        Validators.compose([Validators.minLength(6), Validators.required])],
    });
  }

  signupUser(){
    if (!this.signupForm.valid) {
      console.log(this.signupForm.value);
    } else {
      this.authProvider.signupUser(this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.firstName, this.signupForm.value.lastName)
      .then( () => {
        this.loading.dismiss().then( () => {
          this.navCtrl.setRoot(TabsPage);
        });
      }, (error) => {
        this.loading.dismiss().then( () => {
          let alert = this.alertCtrl.create({
            message: error.message,
            buttons: [
              {
                text: "Ok",
                role: 'cancel'
              }
            ]
          });
          alert.present();
        });
      });
      this.loading = this.loadingCtrl.create();
      this.loading.present();
      let toast = this.toastCtrl.create({
        message: "User created successfully",
        duration: 3000
      });
      toast.present();
    }
  }
}
