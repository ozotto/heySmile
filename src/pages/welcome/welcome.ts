import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { MainPage } from '../../pages/pages';
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { ConditionsPage } from '../conditions/conditions';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Platform } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';

import { Storage } from '@ionic/storage';
import { UserService } from '../../app/UserService';

import { FormBuilder,FormGroup,Validators } from '@angular/forms';
/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

	users: FirebaseListObservable<any[]>;
  displayName; 
  loginForm: FormGroup;
  myForm: FormGroup;
  submitedForm;
  msgPassword;
  show_msgPassword;

  private myData: any;

  constructor(  public navCtrl: NavController, afDB: AngularFireDatabase,
                private afAuth: AngularFireAuth, 
                private fb: Facebook, 
                private platform: Platform, 
                private storage: Storage, UserStore:UserService, 
                private builder: FormBuilder) { 
  	
    //Show msg form
    this.submitedForm = false;
    this.show_msgPassword = false;

    //List User
    this.users = afDB.list("/users")
    afDB.list('/items', ref => ref.orderByChild('email').equalTo('ozotto@gmail.com'))
    

    //Validate form
    this.loginForm    = builder.group({
       'email'        : ['', Validators.required],
       'password'     : ['', Validators.required]
    });
    
    //Auth
    afAuth.authState.subscribe((user: firebase.User) => {
      if (!user) {
        this.displayName = null;
        return;
      }else{

        UserStore.loginState = true
        UserStore.user = user
        /*console.log(user)
        console.log(user.photoURL)*/

        this.navCtrl.push(MainPage);
      }
            
    });

  }

  login(formData) { 
    this.submitedForm = true;
    var self = this;
    if(formData._status == "VALID"){
      var email = formData._value.email;
      var password = formData._value.password;
      this.afAuth.auth.createUserWithEmailAndPassword(email, password).catch(function(error) {
          /*console.log(error.message);*/
          self.msgPassword = error.message;
          self.show_msgPassword = true;
         
      })
    }

  }

  signInWithFacebook() {
    if (this.platform.is('cordova')) {
      return this.fb.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        return firebase.auth().signInWithCredential(facebookCredential);
      })
    }
    else {
      return this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(res => console.log(res));
    }
  }

  sigInGoogle(){
    console.log("google")
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  signOut() {
    this.afAuth.auth.signOut();
  }

  showConditions(){
     this.navCtrl.push(ConditionsPage); 
  }

  /*  signInWithFacebook() {
    this.afAuth.auth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(res => console.log(res));
  }*/

}
