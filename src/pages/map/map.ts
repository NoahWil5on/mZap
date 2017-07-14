import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController} from 'ionic-angular';
import { AngularFireDatabase} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

import { AddPage } from '../add/add';
import { InfoWindowPage } from '../info-window/info-window';

declare var google;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
    @ViewChild('map') mapElement;
    map: any;
    add: boolean = false;
    infoWindow: any = null;
    setOnce: boolean = true;
  constructor(public navCtrl: NavController, public navParams: NavParams, public modal: ModalController,
             public ngZone: NgZone, public fireDB: AngularFireDatabase, public afAuth: AngularFireAuth) {
  }

  ionViewDidLoad() {
      this.initMap();
  }
  doAdd(){
    this.add = !this.add;
      this.ngZone.run(() =>{
          
      });
  }
    addPage(data){
        let addModal = this.modal.create(AddPage, {type: data, pos: this.map.getCenter()});
        addModal.onDidDismiss(data => {
            this.add = false;
            if(data){
                var newMarker = {
                    lat: this.map.getCenter().lat(),
                    lng: this.map.getCenter().lng(),
                    description: data.desc,
                    title: data.title,
                    type: data.type,
                    show: data.show,
                    email: data.email,
                    url: data.url,
                    refName: data.refName,
                    key: ""
                }
                var key = this.fireDB.list('positions').push(newMarker).key;
                this.fireDB.object('positions/'+key +'/key').set(key);
                newMarker.key = key;
                this.makeMarker(newMarker);
            }
        });
        addModal.present();
    }
    makeMarker(data){
        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(data.lat,data.lng),
            map: this.map
        });
        var self = this;
        google.maps.event.addListener(marker, 'click', function(e){
            let infoModal = self.modal.create(InfoWindowPage, {data: data});
            infoModal.onDidDismiss(callBack => {
                if(callBack){
                    marker.setMap(null);
                    marker = null;
                }
            });
            infoModal.present();
        });
    }
    async initMap(){
        let latLng = new google.maps.LatLng(18.318407,-65.296514);
        let mapOptions = {
            center: latLng,
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        var self = this;
        google.maps.event.addListenerOnce(this.map, 'idle', function(event){
            self.fireDB.list('positions', {preserveSnapshot: true})
            .subscribe(snaps => {
                if(self.setOnce){
                    snaps.forEach(function(item){
                        self.makeMarker(item.val());
                    });
                    self.setOnce = false;
                }
            });
        });
    }
}
