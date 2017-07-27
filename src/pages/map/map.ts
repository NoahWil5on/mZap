//Ionic imports
import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, MenuController} from 'ionic-angular';

//page imports
import { AddPage } from '../add/add';
import { ConfirmationPage } from '../confirmation/confirmation'
import { InfoWindowPage } from '../info-window/info-window';
import { SettingsPage } from '../settings/settings';

//provider imports
import { ZonesProvider } from '../../providers/zones/zones';
import { UserInfoProvider } from '../../providers/user-info/user-info';
import { TranslatorProvider } from '../../providers/translator/translator';

//firebase imports
import { AngularFireDatabase} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

//if not declared ionic will throw an error
declare var google;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
    //public fields
    @ViewChild('map') mapElement;
    map: any;
    add: boolean = false;
    infoWindow: any = null;
    setOnce: boolean = true;
    geoMarker: any;
    points: any = [];
    zonies: any = [];
    markers: any = [];
    myMarker: any = undefined;
    myCircle: any = undefined;
    dropDown: boolean = true;
    
    myActiveData: any = {};
    myActiveMarker: any;
    
    /*Instantiate all imported classes*/
    constructor(public navCtrl: NavController, public navParams: NavParams, public modal: ModalController,
             public ngZone: NgZone, public fireDB: AngularFireDatabase, public afAuth: AngularFireAuth,
              public alertCtrl: AlertController, public zones: ZonesProvider, public menuCtrl: MenuController,
                public userInfo: UserInfoProvider, public translate: TranslatorProvider) {
    }

    //as soon as page is loaded run
    ionViewDidLoad() {
        //checks if this is NOT the first time you're opening up the map
        if(this.userInfo.zoom != null){
            //initializes map
            let latLng = new google.maps.LatLng(this.userInfo.lat,this.userInfo.lng);
            let options = {
                center: latLng,
                zoom: this.userInfo.zoom,
                disableDefaultUI: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            this.initMap(options,false);
            
            //if the user allows you to see their position add a blinking dot to their location
            if(this.userInfo.allowPosition){
                var self = this;
                navigator.geolocation.getCurrentPosition((position) => {
                    let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    self.setPin(latLng);
                });
            }
            return;
        }
        //if this is the first time opening up maps then run this function
        this.runNavigation();
    }
    setCenter(){
        var self = this;
        navigator.geolocation.getCurrentPosition((position) => {
            let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            self.map.setCenter(latLng);
            self.map.setZoom(17);
            
            //self.setPin(latLng);
        });
    }
    setPin(latLng){
        if(this.myCircle){
            this.myCircle.setMap(null);
            this.myMarker.setMap(null);
            this.myCircle = null;
            this.myMarker = null;
        }

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
            strokeColor: '#444',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#aaa',
            fillOpacity: 0.35,
            map: this.map,
            center: latLng,
            radius: 150
          });
        this.animate(latLng);
    }
    runNavigation(){
        var self = this;
        
        //check if the user will let you see their position
        navigator.geolocation.getCurrentPosition(function(position){
            self.userInfo.allowPosition = true;
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
    //any time the "menu" button is clicked
    openMenu(){
        this.menuCtrl.open();
    }
    //deprecated
    openSettings(){
        this.navCtrl.push(SettingsPage);
    }
    /*Toggle add and update DOM*/
    doAdd(){
        this.add = !this.add;
        this.ngZone.run(() =>{
        });
    }
    addFalse(){
        this.add = false;
        this.ngZone.run(() =>{
        });
    }
    dropFalse(){
        this.dropDown = true;
    }
    addPage(data){
        let title = "";
        let description = "";
        
        //switch for message to show user when they click on add button
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
        //tell the user what they're about to do
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
                                if(data.url){
                                    newMarker = {
                                        lat: this.map.getCenter().lat(),
                                        lng: this.map.getCenter().lng(),
                                        description: data.desc,
                                        type: data.type,
                                        show: data.show,
                                        email: "",
                                        url: data.url,
                                        refName: data.refName,
                                        status: "To Do",
                                        key: ""
                                    }
                                    if(data.email){
                                        newMarker.email = data.email;
                                    }
                                }
                                //if there is an image available set the image location
                                else{
                                     newMarker = {
                                        lat: this.map.getCenter().lat(),
                                        lng: this.map.getCenter().lng(),
                                        description: data.desc,
                                        type: data.type,
                                        show: data.show,
                                        email: "",
                                        status: "To Do",
                                        key: ""
                                    }
                                    if(data.email){
                                        newMarker.email = data.email;
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
        
        //switch for positions markers around the map
        //tells google what image to use as the marker
        switch(data.type){
            case 'bugs':
                selection = 'assets/images/symbols/mosquito_black.png';
                break;
            case 'trash':
                selection = 'assets/images/symbols/trash_black.png';
                break;
            case 'building':
                selection = 'assets/images/symbols/building_black.png';
                break;
            case 'pest':
                selection = 'assets/images/symbols/pest_black.png';
                break;
            default:
                selection = 'assets/images/symbols/mosquito_black.png';
                break;
        };
        //creates the marker with the specified icon
        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(data.lat,data.lng),
            icon: selection,
            map: this.map
        });
        this.markers.push(marker);
        var self = this;
        /*Allows an info window to pop up when a point is clicked*/
        /*google.maps.event.addListener(marker, 'click', function(e){
            
        });*/
        google.maps.event.addListener(marker, 'click', function(e){
            self.myActiveData = data;
            self.myActiveMarker = marker
            self.dropDown = false;
        });
    }
    doInfoWindow(){
        let infoModal = this.modal.create(InfoWindowPage, {data: this.myActiveData});
        infoModal.onDidDismiss(callBack => {
            if(callBack){
                this.myActiveMarker.setMap(null);
                this.myActiveMarker = null;
                this.navCtrl.setRoot(MapPage);
            }
        });
        infoModal.present();
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
        google.maps.event.addListener(this.map, 'click', function(e){
            self.dropDown = true;
        })
        google.maps.event.addListener(this.map, 'drag', function(e){
            self.dropDown = true;
        })
        //anytime the bounds change update the "saved" position so if the 
        //user changes pages and comes back they will be at the same lat/lng
        //and same zoom as when they left the map
        google.maps.event.addListener(this.map, 'bounds_changed', event => {
            this.userInfo.lat = this.map.getCenter().lat();
            this.userInfo.lng = this.map.getCenter().lng();
            this.userInfo.zoom = this.map.getZoom();
        })
        //if the user let you see their position then place
        //a blinking dot at their location
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
                strokeColor: '#444',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#aaa',
                fillOpacity: 0.35,
                map: this.map,
                center: latLng,
                radius: 150
              });
            this.animate(latLng);
        }
    }
    //any "cluster" zone that is found on the map is drawn here
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
                radius: ((zones[i].dist/2) + 200)
              }));
        }
    }
    //animates the user's position
    animate(latLng){
        var self = this;
        var options = {
            strokeColor: '#444',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#aaa',
            fillOpacity: 0.35,
            map: this.map,
            center: latLng,
            radius: 150
        }
        var skip
        setInterval(function(){
            if(options.radius > 150){
                options.radius = 0;
                skip = true;
            }
            if(!skip){
                options.strokeOpacity = (150-options.radius)/150;
                options.fillOpacity = (150-options.radius)/150;
            }
            //fun little formula to make the circle's delta radius decrease at an inverse
            //exponential rate overtime
            options.radius += Math.pow((320-options.radius)/150, 2)/3;
            self.myCircle.setOptions(options);     
            skip = false;
          //  }
        },30)
    }
}
