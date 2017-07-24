import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController} from 'ionic-angular';
import { AngularFireDatabase} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ZonesProvider } from '../../providers/zones/zones';
import { AddPage } from '../add/add';
import { ConfirmationPage } from '../confirmation/confirmation'
import { InfoWindowPage } from '../info-window/info-window';
import { MenuController } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';

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
    geoMarker: any;
    points: any = [];
    zonies: any = [];
    markers: any = [];
    myMarker: any;
    myCircle: any;
    
    /*Instantiate all imported classes*/
    constructor(public navCtrl: NavController, public navParams: NavParams, public modal: ModalController,
             public ngZone: NgZone, public fireDB: AngularFireDatabase, public afAuth: AngularFireAuth,
              public alertCtrl: AlertController, public zones: ZonesProvider, public menuCtrl: MenuController) {
    }

    ionViewDidLoad() {
        this.runNavigation();
    }
    setCenter(){
        var self = this;
        navigator.geolocation.getCurrentPosition((position) => {
            let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            self.map.setCenter(latLng);
            self.map.setZoom(17);
            
            self.myCircle.setMap(null);
            self.myMarker.setMap(null);
            self.myCircle = null;
            self.myMarker = null;
            
            var markerImage = new google.maps.MarkerImage('assets/new/dot.png',
                new google.maps.Size(20, 20),
                new google.maps.Point(0, 0),
                new google.maps.Point(10, 10));
            
            self.myMarker = new google.maps.Marker({
                    position: latLng,
                    icon: markerImage,
                    map: self.map
                });
            self.myCircle = new google.maps.Circle({
                strokeColor: '#888',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#aaa',
                fillOpacity: 0.35,
                map: self.map,
                center: latLng,
                radius: 150
              });
        });
    }
    runNavigation(){
        var self = this;
        navigator.geolocation.getCurrentPosition(function(position){
            let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            let options = {
                center: latLng,
                zoom: 17,
                disableDefaultUI: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            self.initMap(options,true);
        },function(){
            let latLng = new google.maps.LatLng(18.318407,-65.296514);
            let options = {
                center: latLng,
                zoom: 12,
                disableDefaultUI: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            self.initMap(options,false);
        });
    }
    openMenu(){
        this.menuCtrl.open();
    }
    openSettings(){
        this.navCtrl.push(SettingsPage);
    }
    /*Toggle add and update DOM*/
  doAdd(){
    this.add = !this.add;
      this.ngZone.run(() =>{
      });
  }
    addPage(data){
        let title = "";
        let description = "";
        switch(data){
            case 'building':
                title = "Abandoned building";
                description = "Report an abandoned building at this location";
                break;
            case 'bugs':
                title = "Mosquitos";
                description = "Report a breeding location of mosquitos at this location";
                break;
            case 'pest':
                title = "Pests";
                description = "Make a report on pests you found at this location";
                break;
            case 'trash':
                title = "Garbage";
                description = "Report an instance of garbage at this location";
                break;
            default:
                break;
        }
        let infoAlert = this.alertCtrl.create({
            title: title,
            subTitle: description,
            buttons: [
                {
                    text: "OK",
                    handler: () =>{
                        let addModal = this.modal.create(AddPage, {type: data, pos: this.map.getCenter()});
                        /*Create new point when modal is dismissed*/
                        addModal.onDidDismiss(data => {
                            this.add = false;
                            if(data){
                                //instantiates a marker with all specified fields
                                var newMarker;
                                if(data.title){
                                    newMarker = {
                                        lat: this.map.getCenter().lat(),
                                        lng: this.map.getCenter().lng(),
                                        description: data.desc,
                                        type: data.type,
                                        show: data.show,
                                        email: data.email,
                                        url: data.url,
                                        refName: data.refName,
                                        status: "To Do",
                                        key: ""
                                    }
                                }
                                else{
                                     newMarker = {
                                        lat: this.map.getCenter().lat(),
                                        lng: this.map.getCenter().lng(),
                                        description: data.desc,
                                        type: data.type,
                                        show: data.show,
                                        email: data.email,
                                        status: "To Do",
                                        key: ""
                                    }
                                }
                                /*Push point to firebase and give it a reference*/
                                var key = this.fireDB.list('positions').push(newMarker).key;
                                this.fireDB.object('positions/'+key +'/key').set(key);
                                newMarker.key = key;
                                this.makeMarker(newMarker);
                                let confirm = this.modal.create(ConfirmationPage, newMarker);
                                confirm.present();
                                confirm.onDidDismiss(_ => {
                                    this.navCtrl.setRoot(MapPage);
                                })
                            }
                        });
                        addModal.present();
                    }
                },
                {
                    text: "Cancel",
                }
            ]
        });
        infoAlert.present();
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
        var selection = '';
        switch(data.type){
            case 'water':
                selection = 'assets/new/droplet.png';
                break;
            case 'bugs':
                selection = 'assets/mosquito_sm.png';
                break;
            case 'trash':
                selection = 'assets/new/trash.png';
                break;
            case 'building':
                selection = 'assets/new/building.png';
                break;
            case 'rat':
                selection = 'assets/new/rat.png';
                break;
            default:
                selection = 'assets/mosquito_sm.png';
                break;
        };
        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(data.lat,data.lng),
            icon: selection,
            map: this.map
        });
        this.markers.push(marker);
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
    initMap(options, bool){
        this.map = new google.maps.Map(this.mapElement.nativeElement, options);
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
                    var promiseObject = self.zones.runEval(self.points,600);
                    
                    //wait for runEval to finish
                    promiseObject.promise.then(_ => {
                        //add zones to to all specified points
                        self.applyZones(promiseObject.zones);
                    });
                }
            });
        });
        if(bool){
            let latLng = new google.maps.LatLng(this.map.getCenter().lat(),this.map.getCenter().lng())
            var markerImage = new google.maps.MarkerImage('assets/new/dot.png',
                new google.maps.Size(20, 20),
                new google.maps.Point(0, 0),
                new google.maps.Point(10, 10));
            
            this.myMarker = new google.maps.Marker({
                position: latLng,
                icon: markerImage,
                map: this.map
            });
            this.myCircle = new google.maps.Circle({
                strokeColor: '#888',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#aaa',
                fillOpacity: 0.35,
                map: this.map,
                center: latLng,
                radius: 150
              });
        }
    }
    applyZones(zones){
        for(var i = 0; i < zones.length; i++){
            this.zonies.push(new google.maps.Circle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: this.map,
                center: new google.maps.LatLng(zones[i].lat,zones[i].lng),
                radius: zones[i].dist
              }));
        }
    }
}
