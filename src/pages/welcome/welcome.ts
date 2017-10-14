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

	items: FirebaseListObservable<any[]>;
  displayName; 
  loginForm: FormGroup;
  myForm: FormGroup;
  submitedForm;
  private myData: any;

  constructor(  public navCtrl: NavController, afDB: AngularFireDatabase,
                private afAuth: AngularFireAuth, 
                private fb: Facebook, 
                private platform: Platform, 
                private storage: Storage, UserStore:UserService, 
                private builder: FormBuilder) { 
  	/*this.items = afDB.list('/podium');
    console.log(this.items)*/
    /*afAuth.authState.subscribe(user => {
      if (!user) {
        this.displayName = null;        
        return;
      }
      this.displayName = user.displayName;      
    });*/
    this.submitedForm = false;

    this.myForm = builder.group({
      /*'subject': '',
      'message': ''*/
       'subject': ['', Validators.required],
      'message': ['', Validators.required]
    })

    this.loginForm    = builder.group({
         'email'        : ['', Validators.required],
         'password'     : ['', Validators.required]
      });

    /*this.loginForm = builder.group({
      'username': [
        '',
        Validators.compose([Validators.required, Validators.minLength(5)])
      ],
      'password': [
        '',
        Validators.compose([Validators.required, Validators.minLength(5)])
      ]
    });*/

    
    afAuth.authState.subscribe((user: firebase.User) => {
      if (!user) {
        this.displayName = null;
        return;
      }else{
/*        storage.set('user', user);
        storage.get('user').then((val) => {
          console.log('Your age is', val);
        });*/
        UserStore.loginState = true
        UserStore.userFacebook = user
        console.log(user)
        console.log(user.photoURL)

        this.displayName = user.displayName;
        this.navCtrl.push(MainPage);
      }
            
    });

  }

  onSubmit(formData) {
    this.submitedForm = true;
    if(formData._status == "VALID"){
      console.log('Form data is ', formData);
      this.myData = formData;  
    }
  }

  login() { 
    var email = "myemail@email.com";
    var password = "mypassword";
    this.afAuth.auth.createUserWithEmailAndPassword(email, password).catch(function(error) {
       console.log(error);
       console.log(error);
    })
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

/*  signInWithFacebook() {
    this.afAuth.auth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(res => console.log(res));
  }*/

  signOut() {
    this.afAuth.auth.signOut();
  }

  signup() {
    this.navCtrl.push(SignupPage);
  }

  showConditions(){
     this.navCtrl.push(ConditionsPage); 
  }

}
