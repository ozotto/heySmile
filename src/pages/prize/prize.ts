import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { MainPage } from '../../pages/pages';
import { PrizeCreatePage } from '../prize-create/prize-create';

import { TranslateService } from '@ngx-translate/core';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'page-prize',
  templateUrl: 'prize.html'
})
export class PrizePage {

	prizes: FirebaseListObservable<any[]>;
	user: any;
	showAdd;

  constructor(	public navCtrl: NavController,
  				public afDB: AngularFireDatabase, 
  				public modalCtrl: ModalController,
  				private afAuth: AngularFireAuth) {

  	this.prizes = afDB.list('/prize');
  	this.showAdd = false
  	this.afAuth.authState.subscribe(userAuth => {
      if(userAuth){
      		this.user = userAuth
      		if(this.user.email == 'ozotto@hotmail.com' || this.user.email == 'ozotto@gmail.com') this.showAdd = true
      } 
    })

  	
  }

  addPrize() {
    let addModal = this.modalCtrl.create(PrizeCreatePage);
    addModal.onDidDismiss(item => {
      if (item) {
       
        this.prizes.push({ 
        	title : item.titre,
        	description : item.desc,
     			date: item.date,
          picture : item.profilePic,
        });
    
      }
    })
    addModal.present();
  }

}
