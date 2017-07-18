import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController} from 'ionic-angular';
import { AngularFireDatabase} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ZonesProvider } from '../../providers/zones/zones';
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
    points: any = [];
    
    /*Instantiate all imported classes*/
  constructor(public navCtrl: NavController, public navParams: NavParams, public modal: ModalController,
             public ngZone: NgZone, public fireDB: AngularFireDatabase, public afAuth: AngularFireAuth,
              public alertCtrl: AlertController, public zones: ZonesProvider) {
  }

  ionViewDidLoad() {
      this.initMap();
  }
    /*Toggle add and update DOM*/
  doAdd(){
    this.add = !this.add;
      this.ngZone.run(() =>{
      });
  }
    addPage(data){
        let addModal = this.modal.create(AddPage, {type: data, pos: this.map.getCenter()});
        /*Create new point when modal is dismissed*/
        addModal.onDidDismiss(data => {
            this.add = false;
            if(data){
                //instantiates a marker with all specified fields
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
                /*Push point to firebase and give it a reference*/
                var key = this.fireDB.list('positions').push(newMarker).key;
                this.fireDB.object('positions/'+key +'/key').set(key);
                newMarker.key = key;
                this.makeMarker(newMarker);
            }
        });
        addModal.present();
    }
    /*Checks if user is logged in to prevent them from making changes if
    *They're signed in anonymously. Even if they try and make
    *changes anonymously the database won't accept the changes
    *But they will receive an error on the front end which is no good
    */
    isLoggedIn(){
        if(this.afAuth.auth.currentUser)
            return true;
        return false;
    }
    /*Is called anytime a point is found in the database or created*/
    makeMarker(data){
        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(data.lat,data.lng),
            icon: '../../assets/mosquito_sm.png',
            map: this.map
        });
        var self = this;
        /*Allows an info window to pop up when a point is clicked*/
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
    /*Initializes map, async operation operation 
    *because map could take some time to load*/
    async initMap(){
        let latLng = new google.maps.LatLng(18.318407,-65.296514);
        let mapOptions = {
            center: latLng,
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        //Use self in event listeners because it moves out of the map's scope
        var self = this;
        /*Waits for map to load and then adds all the points to the map*/
        google.maps.event.addListenerOnce(this.map, 'idle', function(event){
            self.fireDB.list('positions', {preserveSnapshot: true})
            .subscribe(snaps => {
                if(self.setOnce){
                    snaps.forEach(function(item){
                        self.makeMarker(item.val());
                        self.points.push(item.val());
                    });
                    self.setOnce = false;
                    var promiseObject = self.zones.runEval(self.points);
                    
                    //wait for runEval to finish
                    promiseObject.promise.then(_ => {
                        //add zones to to all specified points
                        self.applyZones(promiseObject.zones);
                    });
                }
            });
        });
    }
    applyZones(zones){
        /*console.log("Apply Zones is working");
        for(var i = 0; i < zones.length; i++){
            new google.maps.Circle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: this.map,
                center: new google.maps.LatLng(zones[i].lat,zones[i].lng),
                radius: 1000
              });
        }*/
    }
}
