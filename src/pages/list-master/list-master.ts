import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { WelcomePage } from '../welcome/welcome';

import { ItemCreatePage } from '../item-create/item-create';
import { ItemDetailPage } from '../item-detail/item-detail';

import { Items } from '../../providers/providers';

import { Item } from '../../models/item';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserService } from '../../app/UserService';

@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  currentItems: Item[];

  smiles: FirebaseListObservable<any[]>;
  smile: FirebaseObjectObservable<any>;
  itemTest
  user
  store

  constructor(public navCtrl: NavController, public items: Items, public modalCtrl: ModalController, 
    public afDB: AngularFireDatabase, UserStore:UserService, private afAuth: AngularFireAuth) {
    /*console.log(UserStore.loginState)
    console.log(UserStore.user)*/

    this.currentItems = this.items.query();
    this.smiles = afDB.list('/smiles');
    this.user = UserStore
    this.store = afDB

  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addItem() {
    let addModal = this.modalCtrl.create(ItemCreatePage);
    addModal.onDidDismiss(item => {
      if (item) {
        /*console.log("value")
        console.log(item)
        console.log(this.smiles)*/
     
        this.smiles.push({ 
          user: {displayName: this.user.user.displayName, photo: this.user.user.photoURL, email : this.user.user.email}, 
          date: "28-08-2017",
          picture : item.profilePic,
          likes : 0,
          unlikes : 0,
          danger : 0
        });
     

        /*this.items.add(item);*/
      }
    })
    addModal.present();
  }

  addLikes(item){
    let value = item.likes + 1
    this.store.object('/smiles/' + item.$key)
    .update({ likes: value });
  }

  addUnlikes(item){
    let value = item.unlikes + 1
    this.store.object('/smiles/' + item.$key)
    .update({ unlikes: value });
  }

  addDanger(item){
    let value = item.danger + 1
    this.store.object('/smiles/' + item.$key)
    .update({ danger: value });
  }

  /**
   * Delete an item from the list of items.
   */
  deleteItem(item) {
    this.items.delete(item);
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Item) {
    this.navCtrl.push(ItemDetailPage, {
      item: item
    });
  }
  
  signOut() {
    this.afAuth.auth.signOut();
    this.navCtrl.push(WelcomePage);
  }

}
