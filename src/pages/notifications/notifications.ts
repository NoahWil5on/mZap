import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Events } from 'ionic-angular';
import { MapPage } from '../map/map'

import { UserInfoProvider } from '../../providers/user-info/user-info';

import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  notes: any = [];
  change: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, public afAuth: AngularFireAuth, public userInfo: UserInfoProvider, public events: Events) {
    var self = this;
    firebase.database().ref(`notifications/${this.afAuth.auth.currentUser.uid}`).once('value').then(snapshot => {
      snapshot.forEach(function(post){
        if(typeof post.val() == 'number') return;
        firebase.database().ref(`notifications/${self.afAuth.auth.currentUser.uid}/${post.key}`).once('value').then(snap =>{
          snap.forEach(function(item){
            var note = {
              message: item.val().message,
              name: item.val().name,
              seen: item.val().seen,
              time: item.val().time,
              postType: "positions",
              shipNumber: "",
              key: post.key
            }
            if(item.val().postType){
                note.postType = item.val().postType;
            }
            if(item.val().shipNumber){
                note.shipNumber = item.val().shipNumber;
            }
            self.notes.push(note);
            if(!note.seen){
              self.change.push({
                key: post.key,
                type: item.key
              });
            }
          })
        }).then(_ => {
          self.notes.sort(function(a, b){ return b.time-a.time });
        })
      })
    })
  }
  ionViewWillLeave(){
    if(this.afAuth.auth.currentUser == null) return;
    this.change.forEach(item => {
      firebase.database().ref(`notifications/${this.afAuth.auth.currentUser.uid}/${item.key}/${item.type}`).update({seen: true});
    });
    firebase.database().ref(`notifications/${this.afAuth.auth.currentUser.uid}`).update({count: 0});
  }
  openPost(data){
    var self = this;
    this.navCtrl.setRoot(MapPage);

    var refLocation = `/positions/${data.key}`;
    if(data.postType = 'ships'){
        refLocation = `/${data.postType}/${data.shipNumber}/${data.key}`;
    }

    firebase.database().ref(refLocation).once('value', snapshot => {      
      self.userInfo.activeData = snapshot.val();    
    }).then(() => {
      self.userInfo.lat = self.userInfo.activeData.lat;
      self.userInfo.lng = self.userInfo.activeData.lng;
      self.userInfo.zoom = 20;
      self.navCtrl.setRoot(MapPage).then(() => {
        self.userInfo.pageState = 'map';
        self.userInfo.openInfo = true;    
      });  
    })
  }
  //open nav menu
  openMenu(){
      this.menuCtrl.open();
  }
}
