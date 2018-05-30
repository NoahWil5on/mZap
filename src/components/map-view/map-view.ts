//Ionic imports
import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams, ModalController, MenuController, Events } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
// import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation';

//page imports
import { FilterPage } from '../../pages/filter/filter';
import { MapPage } from '../../pages/map/map';

//provider imports
import { ZonesProvider } from '../../providers/zones/zones';
import { UserInfoProvider } from '../../providers/user-info/user-info';
import { TranslatorProvider } from '../../providers/translator/translator';
import { LikeProvider } from '../../providers/like/like';
import { ClickProvider } from '../../providers/click/click';

//image popup viewing import
import { ImageViewerController } from 'ionic-img-viewer';

//geographic distance calculator import
// import geolib from 'geolib';

//firebase imports
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

//if not declared ionic will throw an error
declare var google;

@Component({
    selector: 'map-view',
    templateUrl: 'map-view.html'
})
export class MapViewComponent {

    //public fields
    @ViewChild('map') mapElement;
    map: any;
    heatMap: any;
    setOnce: boolean = true;
    showButtons: boolean = true;
    points: any = [];
    markers: any = [];
    heatMapData: any = [];

    dropDown: boolean = false;
    distance: any = 0;
    likeValue: any = false;
    likes: any = 0;
    deactivate: boolean = false;

    myMarker: any = undefined;
    myCircle: any = undefined;
    myOptions: any = undefined;
    // myDirection: any;
    // orientationSub: any;

    hybrid: boolean = false;

    myActiveData: any = {};
    type: any = '';
    myActiveMarker: any;

    /*Instantiate all imported classes*/
    constructor(public navCtrl: NavController, public navParams: NavParams, public modal: ModalController, public ngZone: NgZone, public fireDB: AngularFireDatabase, public afAuth: AngularFireAuth, public zones: ZonesProvider, public menuCtrl: MenuController, public userInfo: UserInfoProvider, public translate: TranslatorProvider, public likeProvider: LikeProvider, public click: ClickProvider, public mapPage: MapPage, public events: Events, public imageViewerCtrl: ImageViewerController, public geolocation: Geolocation){
        mapPage.mapView = this;
    }
    ngAfterViewInit() {

        //checks if this is NOT the first time you're opening up the map
        if (this.userInfo.zoom != null) {
            //initializes map
            let latLng = new google.maps.LatLng(this.userInfo.lat, this.userInfo.lng);
            let options = {
                center: latLng,
                zoom: this.userInfo.zoom,
                disableDefaultUI: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            this.initMap(options, false);

            //if the user allows you to see their position add a blinking dot to their location
            if (this.userInfo.allowPosition) {
                var self = this;
                this.geolocation.getCurrentPosition({enableHighAccuracy: true}).then((position) => {
                    let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    self.setPin(latLng);
                });
            }
            return;
        }
        //if this is the first time opening up maps then run this function
        this.runNavigation();
    }
    toggleMap() {
        this.hybrid = !this.hybrid;
        if (this.hybrid) {
            this.map.setMapTypeId(google.maps.MapTypeId.HYBRID);
            this.map.setTilt(0);
        }
        else {
            this.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
        }
    }
    setCenter() {
        var self = this;
        //check if the user is allowing you to see their position
        this.geolocation.getCurrentPosition({enableHighAccuracy: true}).then((position) => {
            let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            self.map.setCenter(latLng);
            self.map.setZoom(17);
            //self.myOptions.center = latLng;
            if(self.myOptions == undefined){
                self.myOptions = {
                    strokeColor: '#444',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#aaa',
                    fillOpacity: 0.35,
                    map: this.map,
                    center: latLng,
                    radius: 150
                }
            }else{
                self.myOptions.center = latLng;
            }
            if(self.myMarker){
                self.myMarker.setPosition(latLng);
            }
        });
    }
    //sets personal marker and circle
    setPin(latLng) {
        if (this.myCircle != null) {
            this.myCircle.setMap(null);
            this.myMarker.setMap(null);
            this.myCircle = null;
            this.myMarker = null;
        }

        var markerImage = new google.maps.MarkerImage('assets/new/dot.png',
            new google.maps.Size(20, 20),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 10));

        //personal marker
        this.myMarker = new google.maps.Marker({
            position: latLng,
            icon: markerImage,
            map: this.map,
        });
        //personal circle
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
        if(this.map.getZoom() <= 12){
            this.myMarker.setVisible(false);
            this.myCircle.setVisible(false);
        }
        this.animate(latLng);
    }
    runNavigation() {
        var self = this;

        //check if the user will let you see their position
        this.geolocation.getCurrentPosition({enableHighAccuracy: true}).then(function (position) {
            self.userInfo.allowPosition = true;
            let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            let options = {
                center: latLng,
                zoom: 17,
                disableDefaultUI: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            self.initMap(options, true);
        }).catch( function () {
            let latLng = new google.maps.LatLng(18.318407, -65.296514);
            let options = {
                center: latLng,
                zoom: 12,
                disableDefaultUI: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            self.initMap(options, false);
        });
    }
    //any time the "menu" button is clicked
    openMenu() {
        this.menuCtrl.open();
    }
    openFilter() {
        var filterPage = this.modal.create(FilterPage, { target: 'map' });
        filterPage.onDidDismiss(data => {
            if (data) {
                this.navCtrl.setRoot(MapPage);
            }
        })
        filterPage.present();
    }
    submitReport(data) {
        var newMarker;
        newMarker = {
            lat: this.map.getCenter().lat(),
            lng: this.map.getCenter().lng(),
            description: data.desc,
            type: data.type,
            show: data.show,
            name: this.afAuth.auth.currentUser.displayName,
            id: this.afAuth.auth.currentUser.uid,
            url: data.url,
            refName: data.refName,
            status: "To Do",
            key: "",
            date: Date.now(),
        }
        //var today = new Date();
        //var date = (today.getMonth() + 1) + "-" + today.getDate() + "-" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        //newMarker.date = date;

        /*Push point to firebase and give it a reference*/
        var key = this.fireDB.list('positions').push(newMarker).key;
        this.fireDB.object('positions/' + key + '/key').set(key);
        newMarker.key = key;
        this.makeMarker(newMarker);

        //update # of posts
        var userRating = firebase.database().ref('/userRating/').child(this.afAuth.auth.currentUser.uid)
        userRating.once('value', snap => {
            if (!snap.hasChild('posts')) {
                userRating.child('posts').set(1);
            } else {
                userRating.child('posts').set(snap.val().posts + 1);
            }
        }).then(_ => {
            data.loader.dismiss();
            this.events.publish("share");
        });
    }    

    /*Checks if user is logged im*/
    isLoggedIn() {
        if (this.afAuth.auth.currentUser)
            return true;
        return false;
    }
    //show pop up of image when image is clicked on
    presentImage(myImage){
        let imageViewer = this.imageViewerCtrl.create(myImage);
        imageViewer.present();
    }
    //runs if the map is touched
    //removes info drop down
    mapTouch(){
        this.dropDown = false;
        this.userInfo.activeData = {};
    }
    translateStatus(status){
        //console.log(status);
        switch(status){
            case 'Complete':
                return this.translate.text.other.complete;
            case 'To Do':
                return this.translate.text.other.todo;
            default:
                break;
        }
    }
    translateType(type){
        switch(type){
            case 'bugs':
                return this.translate.text.other.bug;
            case 'trash':
                return this.translate.text.other.trash;
            case 'building':
                return this.translate.text.other.building;
            case 'pest':
                return this.translate.text.other.pest;
            case 'cnd':
              return this.translate.text.other.cnd;
            case 'road':
              return this.translate.text.other.road;
            case 'electricity':
              return this.translate.text.other.electricity;
            case 'tree':
              return this.translate.text.other.tree;
            case 'rocked':
              return this.translate.text.other.rocked;
            case 'water':
              return this.translate.text.other.water;
            case 'drop':
              return this.translate.text.other.drink;
            default:
                break;
          };
    }
    ////////////////////////////////////////////////////////////////////////////////////////
    likeable(){
        var self = this;
        this.likeProvider.likeable(this.userInfo.activeData.key, function(value){
            //ngZone.run updates the DOM otherwise change is not visible
            self.ngZone.run(() =>{
                if(value == 0 || value == -1){
                    self.likeValue = false;
                }   
                else{
                    self.likeValue = true;
                }
                self.deactivate = false;
            });
        });
    }
    like(){
        this.deactivate = true;
        var self = this;
        this.likeProvider.like(this.userInfo.activeData.key, function(val){
            if(val > 99) val = 99;
            self.likes = val;
            self.likeable();
            self.deactivate = false;
        })
    }
    ////////////////////////////////////////////////////////////////////////////////////////
    openChat(){
        this.mapPage.infoShow = true;
        this.mapPage.mapState = "comment";
    }
    openResolve(){
        this.mapPage.infoShow = true;
        this.mapPage.mapState = "edit";
    }
    /*Is called anytime a point is found in the database or created*/
    makeMarker(data) {
        var selection = '';

        //switch for positions markers around the map
        //tells google what image to use as the marker
        switch (data.type) {
            case 'bugs':
                selection = 'assets/images/icons/bug';
                break;
            case 'trash':
                selection = 'assets/images/icons/trash';
                break;
            case 'building':
                selection = 'assets/images/icons/building';
                break;
            case 'pest':
                selection = 'assets/images/icons/pest';
                break;
            case 'cnd':
                selection = 'assets/images/icons/cnd';
                break;
            case 'water':
                selection = 'assets/images/icons/droplet';
                break;
            case 'road':
                selection = "assets/images/icons/road";
                break;
            case 'electricity':
                selection = "assets/images/icons/electricity";
                break;
            case 'tree':
                selection = "assets/images/icons/tree";
                break;
            case 'rocked':
                selection = "assets/images/icons/blocked_road";
                break;
            case 'drop':
                selection = "assets/images/icons/water";
                break;
            default:
                selection = 'assets/images/icons/bug';
                break;
        };
        if(data.status == "To Do"){
            selection += ".png";
        }else{
            selection += "_gray.png";
        }
        var image = {
            url: selection,
            size: new google.maps.Size(40,40),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(15,15),
            scaledSize: new google.maps.Size(30,30),
        };
        //geofence instance
        // let fence = {
        //     id: data.key,
        //     latitude: data.lat,
        //     longitude: data.lng,
        //     radius: 10,
        //     translateType: 1,
        //     notification: {
        //         id: data.key,
        //         title: "You just crossed a fence",
        //         text: "Test text",
        //         openAppOnClick: true
        //     }
        // }
        // this.geofence.addOrUpdate(fence).then(
        //     () => console.log('Geofence added'),
        //     (err) => {console.log(`Error: ${err}`)}
        // );

        //creates the marker with the specified icon
        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(data.lat, data.lng),
            icon: image,
            map: this.map
        });
        this.markers.push(marker);
        var self = this;
        if(this.map.getZoom() <= 12){
            marker.setVisible(false);
            this.showButtons = false;
        }
        /*Allows an info window to pop up when a point is clicked*/
        google.maps.event.addListener(marker, 'click', function(e){
            self.doOpen(data, marker);
        });
        google.maps.event.addListener(this.map, 'zoom_changed', function (e) {
            var zoom = self.map.getZoom();
            if (zoom > 12) {
                marker.setVisible(true);
                self.showButtons = true;
            }
            else {
                marker.setVisible(false);
                self.showButtons = false;
            }
        })
    }
    doOpen(data, marker){
        this.deactivate = true;
        this.myActiveData = data;
        this.dropDown = true;            
        // self.distance = geolib.getDistance(
        //     {latitude: marker.getPosition().lat(), longitude: marker.getPosition().lng()},
        //     {latitude: self.myMarker.getPosition().lat(), longitude: self.myMarker.getPosition().lng()})/1000;
        //self.mapPage.infoShow = true;
        this.userInfo.activeData = data;
        if(!this.userInfo.activeData.likes){
            this.userInfo.activeData.likes = 0;
        }
        this.likeValue = false;
        this.likeable();
        this.checkLikes(this.myActiveData.key);
        this.myActiveMarker = marker;
    }
    checkLikes(postId){
        firebase.database().ref(`/positions/${postId}/likes`).once('value', snapshot => {
            this.likes = snapshot.val();
        });
    }
    //make sure each point passes filter
    checkPoint(item) {
        if (!this.userInfo.filter) return true;
        let check = false;

        //filter by type
        for (var i = 0; i < this.userInfo.filter.type.length; i++) {
            if (item.type == this.userInfo.filter.type[i]) {
                check = true;
                break;
            }
        }
        if (!check) return false;
        check = false;

        //fileter by status
        for (i = 0; i < this.userInfo.filter.status.length; i++) {
            if (item.status == this.userInfo.filter.status[i]) {
                check = true;
                break;
            }
        }
        if (!check) return false;
        if (!item.likes) {
            item.likes = 0;
        }
        //filter by rating
        if (item.likes <= this.userInfo.filter.upper &&
            item.likes >= this.userInfo.filter.lower) {
            return true;
        }
        return false;
    }
    initMap(options, bool) {
        this.map = new google.maps.Map(this.mapElement.nativeElement, options);
        //Use self in event listeners because it moves out of the map's scope
        var self = this;
        /*Waits for map to load and then adds all the points to the map*/
        google.maps.event.addListenerOnce(this.map, 'idle', function (event) {
            self.fireDB.list('positions', { preserveSnapshot: true })
                .subscribe(snaps => {
                    if (self.setOnce) {
                        //filter points and create markers
                        snaps.forEach(function (item) {
                            if (!self.checkPoint(item.val())) return;
                            self.makeMarker(item.val());
                            self.points.push(item.val());
                            if(item.val().status != "Complete"){
                                self.heatMapData.push({ location: new google.maps.LatLng(item.val().lat, item.val().lng), weight: 100 });
                            }
                        });
                        self.heatMap = new google.maps.visualization.HeatmapLayer({
                            data: self.heatMapData,
                            map: self.map,
                            radius: 25,
                            maxIntensity: 250
                        });
                        if(self.map.getZoom() > 12){
                            self.heatMap.setMap(null);  
                        }
                        self.setOnce = false;

                    }
                });
            // self.myDirection = new google.maps.Marker({
            //     position: new google.maps.LatLng(self.map.getCenter().lat(),self.map.getCenter().lng()),
            //     map: self.map,
            //     icon: {
            //         path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
            //         scale: 2,
            //         rotation: 10          
            //     }  
            // });   
            // self.orientationSub = self.deviceOrientation.watchHeading().subscribe((res: DeviceOrientationCompassHeading) => {
            //     self.myDirection.setIcon({
            //         path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
            //         scale: 2,
            //         rotation: res.magneticHeading  
            //     });
            // });
        });
        //anytime the bounds change update the "saved" position so if the 
        //user changes pages and comes back they will be at the same lat/lng
        //and same zoom as when they left the map
        google.maps.event.addListener(this.map, 'bounds_changed', event => {
            this.userInfo.lat = this.map.getCenter().lat();
            this.userInfo.lng = this.map.getCenter().lng();
            this.userInfo.zoom = this.map.getZoom();
        });
        //if the user let you see their position then place
        //a blinking dot at their location
        if (bool) {
            let latLng = new google.maps.LatLng(this.map.getCenter().lat(), this.map.getCenter().lng());
            var markerImage = new google.maps.MarkerImage('assets/new/dot.png',
                new google.maps.Size(20, 20),
                new google.maps.Point(0, 0),
                new google.maps.Point(10, 10),
            );

            this.myMarker = new google.maps.Marker({
                position: latLng,
                icon: markerImage,
                map: this.map,
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
            if(this.map.getZoom() <= 12){
                this.myMarker.setVisible(false);
                this.myCircle.setVisible(false);
            }
        }
        google.maps.event.addListener(this.map, 'zoom_changed', function (e) {
            self.mapTouch()
            if(self.myCircle == undefined || !self.myCircle || self.myCircle == null) return;
            var zoom = self.map.getZoom();
            if (zoom > 12) {
                self.myMarker.setVisible(true);
                self.myCircle.setVisible(true);
                if(self.heatMap) self.heatMap.setMap(null);                
            }
            else {
                self.myMarker.setVisible(false);
                self.myCircle.setVisible(false);
                if(self.heatMap) self.heatMap.setMap(self.map);
            }
        })
    }
    //animates the user's position
    animate(latLng) {
        var self = this;
        this.myOptions = {
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
        setInterval(function () {
            if (self.myOptions.radius > 150) {
                self.myOptions.radius = 0;
                skip = true;
            }
            if (!skip) {
                self.myOptions.strokeOpacity = (150 - self.myOptions.radius) / 150;
                self.myOptions.fillOpacity = (150 - self.myOptions.radius) / 150;
            }
            //fun little formula to make the circle's delta radius decrease at an inverse
            //exponential rate overtime
            self.myOptions.radius += Math.pow((320 - self.myOptions.radius) / 150, 2) / 3;
            self.myCircle.setOptions(self.myOptions);
            skip = false;
        }, 30)
    }
}
