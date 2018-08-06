import { Component, ViewChild } from '@angular/core';
import { Events, AlertController, NavController } from 'ionic-angular';

import { MapPage } from '../../pages/map/map';
import { UserInfoProvider } from '../../providers/user-info/user-info';

import * as firebase from 'firebase';

@Component({
    selector: 'edit-ship',
    templateUrl: 'edit-ship.html'
})
export class EditShipComponent {

    @ViewChild('main') main;

    ship: any = "";
    start: any = "";
    end: any = "";

    constructor(public mapPage: MapPage, public event: Events, public alertCtrl: AlertController, public userInfo: UserInfoProvider, public navCtrl: NavController) {
        setTimeout(() => {
            this.main.nativeElement.style.transform = "translate(-50%,-50%)";
        }, 10);
        this.ship = this.userInfo.activeShipData.ship;
        this.start = this.userInfo.activeShipData.start;
        this.end = this.userInfo.activeShipData.end;
    }
    updateShip() {
        var data = this.userInfo.activeShipData;
        var self = this;

        if (this.start == this.end){
            this.closeOut();
            return;
        }
        if (this.ship != data.ship) {
            firebase.database().ref(`/ships/${data.ship}/${data.key}`).once('value', snap => {
                firebase.database().ref(`/ships/${data.ship}/${data.key}`).remove().then(() => {
                    firebase.database().ref(`ships/${this.ship}/${data.key}`).set({
                        key: data.key,
                        date: data.date,
                        arrival: data.arrive,
                        start: self.start,
                        end: self.end,
                        lat: data.lat,
                        lng: data.lng,
                        likes: snap.val().likes,
                        ship: self.ship,
                        id: data.id,
                        name: data.name
                    }).then(() => {
                        self.navCtrl.setRoot(MapPage);
                    });
                });
            });
        } else {
            if (this.start == data.start && this.end == data.end) {
                this.closeOut();
                return;
            } else {
                var start = {
                    lat: data.lat,
                    lng: data.lng
                };
                if (this.start != data.start) {
                    switch (this.start) {
                        case 'faj':
                            start = {
                                lat: 18.334442,
                                lng: -65.631465
                            }
                            break;
                        case 'vq':
                            start = {
                                lat: 18.152701,
                                lng: -65.444698
                            }
                            break;
                        case 'cul':
                            start = {
                                lat: 18.30123,
                                lng: -65.30251
                            }
                            break;
                        case 'cei':
                            start = {
                                lat: 18.22694,
                                lng: -65.60559
                            }
                            break;
                        default:
                            break;
                    }
                    var lat = (Math.random() - .5) * .001;
                    var lng = (Math.random() - .5) * .001;

                    start.lat += lat;
                    start.lng += lng;
                }
                firebase.database().ref(`ships/${data.ship}/${data.key}`).update({
                    start: this.start,
                    end: this.end,
                    lat: start.lat,
                    lng: start.lng
                }).then(() => {
                    self.navCtrl.setRoot(MapPage);
                });
            }
        }
    }
    closeOut() {
        this.mapPage.editShip = false;
    }

}
