//Ionic imports
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

//provider imports
import { UserInfoProvider } from '../../providers/user-info/user-info';
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';

//if not declared ionic will throw an error
declare var google;

@IonicPage({
    segment: 'map/:id'
})
@Component({
    selector: 'page-map',
    templateUrl: 'map.html',
})
export class MapPage {

    infoShow: boolean = false;
    addShow: boolean = false;
    ferryShow: boolean = false;
    reportShow: boolean = false;
    loginShow: boolean = false;
    shareShow: boolean = false;
    ferryRatingShow: boolean = false;
    ferryMenuShow: boolean = false;

    shipChat: boolean = false;
    editShip: boolean = false;
    shipTut: boolean = false;
    resolveTut: boolean = false;
    tut: boolean = false;

    mapView: any;
    loginState: string = 'login'; //default 'login'
    mapState: string = "comment";

    constructor(public navCtrl: NavController, public navParams: NavParams, public userInfo: UserInfoProvider, public events: Events, private afAuth: AngularFireAuth) {
        var self = this;
        var id = navParams.get('id');

        if(this.events['_channels'].deeplink != undefined &&
        this.events['_channels'].deeplink.length > 0){
            this.events.unsubscribe('deeplink');
        }

        if(id != undefined && id != ":id"){
            this.events.subscribe('deeplink', () => {
                firebase.database().ref(`positions/${id}`).once('value', snap => {
                    self.userInfo.activeData = snap.val();
                    //console.log(self.userInfo.activeData);
                    setTimeout(() => {
                        var latLng = new google.maps.LatLng(snap.val().lat, snap.val().lng);
                        self.mapView.map.setCenter(latLng);
                        setTimeout(() => {
                            self.mapView.doOpen(snap.val());
                        }, 500);
                    }, 1000);                    
                }).then(() => {
                });
            });            
        }        
        this.events.subscribe('ferry:open', () => {
            this.ferryShow = true;
            firebase.database().ref(`users/${this.afAuth.auth.currentUser.uid}`).once('value', snap => {
                if (snap.val().shipTut === undefined || !snap.val().shipTut) {
                    this.shipTut = true;
                    firebase.database().ref(`users/${this.afAuth.auth.currentUser.uid}/shipTut`).set(true);
                }
            })
        });
        this.events.subscribe('position:open', () => {
            firebase.database().ref(`users/${this.afAuth.auth.currentUser.uid}`).once('value', snap => {
                if (snap.val().resolveTut === undefined || !snap.val().resolveTut) {
                    this.resolveTut = true;
                    firebase.database().ref(`users/${this.afAuth.auth.currentUser.uid}/resolveTut`).set(true);
                }
            })
        });
        this.events.subscribe('login:open', () => {
            this.loginShow = true;
        });
        this.events.subscribe('login:create', () => {
            this.loginShow = true;
            setTimeout(() => {
                this.loginState = 'create';  
            }, 100);            
        });
        this.events.subscribe('tut:open', () => {
            this.tut = true;
        });
        this.events.subscribe('report:show', () => {
            this.mapView.dropDown = true;
        })
        setTimeout(function () {
            if (self.userInfo.openInfo) {
                self.mapView.doOpen(self.userInfo.activeData, null);
                setTimeout(function () {
                    self.userInfo.openInfo = false;
                }, 100);
            }
        }, 50);
    }
    // ionViewDidLoad(){
    //   var fcm = setInterval(() => {
    //     if(typeof FCMPlugin != 'undefined' ){
    //       clearInterval(fcm);
    //       FCMPlugin.onNotification(data => {
    //         if(data.wasTapped){
    //           alert(JSON.stringify(data));
    //         }else{
    //           alert(JSON.stringify(data));
    //         }
    //       });
    //       FCMPlugin.onTokenRefresh(token => {
    //         alert(token);
    //       });
    //     }else{
    //       console.log("I don't get it");
    //     }
    //   },1000);

    // }
    // setup(){
    //   var promise = new Promise((resolve, reject) => {
    //     FCMPlugin.getToken(token => {
    //       resolve(token);
    //     }, (err) => {
    //       reject(err);
    //     })
    //   });
    //   return promise;
    // }
    // storeToken(token){
    //   firebase.database().ref('/pushTokens/').push({
    //     uid: this.afAuth.auth.currentUser.uid,
    //     devToken: token
    //   }).then(_ => {
    //     firebase.database().ref('/pushMessage/').push({
    //       sender: "bob",
    //       message: "This is a message"
    //     })
    //   })
    // }
}

