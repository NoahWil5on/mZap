//Ionic imports
import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams, ModalController, MenuController, Events, AlertController, LoadingController } from 'ionic-angular';
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
import geolib from 'geolib';

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
    shipDrop: boolean = false;
    distance: any = 0;
    likeValue: any = false;
    likes: any = 0;
    deactivate: boolean = false;

    myMarker: any = undefined;
    myCircle: any = undefined;
    myOptions: any = undefined;
    myPosition: any = undefined;

    hybrid: boolean = false;

    myActiveData: any = {};
    myActiveShipData: any = {};
    type: any = '';
    myActiveMarker: any;


    /*Instantiate all imported classes*/
    constructor(public navCtrl: NavController, public navParams: NavParams, public modal: ModalController, public ngZone: NgZone, public fireDB: AngularFireDatabase, public afAuth: AngularFireAuth, public zones: ZonesProvider, public menuCtrl: MenuController, public userInfo: UserInfoProvider, public translate: TranslatorProvider, public likeProvider: LikeProvider, public click: ClickProvider, public mapPage: MapPage, public events: Events, public imageViewerCtrl: ImageViewerController, public geolocation: Geolocation, public alertCtrl: AlertController, public loadCtrl: LoadingController) {
        mapPage.mapView = this;

        if(this.events['_channels'].markShip != undefined &&
        this.events['_channels'].markShip.length > 0){
            this.events.unsubscribe('markShip');
        }
        this.events.subscribe('markShip', (data) => {
            this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((position) => { 
                var reportLoad = this.loadCtrl.create({
                    content: this.translate.text.add.submitting,
                });
                reportLoad.present();

                let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                var myStart = {
                    lat: latLng.lat(),
                    lng: latLng.lng()
                }
                var start = { lat: 0, lng: 0 };
                switch (data.start) {
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

                myStart.lat += lat;
                myStart.lng += lng;
                if(geolib.getDistance(
                    {latitude: myStart.lat, longitude: myStart.lng},
                    {latitude: start.lat, longitude: start.lng}) > 800){
                        start.lat += lat;
                        start.lng += lng;

                        myStart = start;
                        latLng = new google.maps.LatLng(start.lat, start.lng);
                }
                var now = Date.now();
                var arrive = this.getArrive(1.5);

                if((data.start == 'vq' || data.start == 'cul') &&
                (data.end == 'vq' || data.end == 'cul')){
                    arrive = this.getArrive(.75)
                }
                else if((data.start == 'vq' || data.start == 'cei') &&
                (data.end == 'vq' || data.end == 'cei')){
                    arrive = this.getArrive(.75)
                }
                else if((data.start == 'cul' || data.start == 'cei') &&
                (data.end == 'cul' || data.end == 'cei')){
                    arrive = this.getArrive(1)
                }

                var shipData = {
                    key: "",
                    date: now,
                    arrival: arrive,
                    start: data.start,
                    end: data.end,
                    lat: myStart.lat,
                    lng: myStart.lng,
                    likes: 0,
                    ship: data.ship,
                    id: this.afAuth.auth.currentUser.uid,
                    name: this.afAuth.auth.currentUser.displayName
                };
                var key = firebase.database().ref(`ships/${data.ship}`).push(shipData).key;
                shipData.key = key;

                var confirmation = this.alertCtrl.create({
                    title: this.translate.text.shipReport.submitted,
                    subTitle: this.translate.text.shipReport.thanks,
                    buttons: [{
                        text: 'OK',
                        handler: () => {
                            this.mapPage.ferryMenuShow = false;
                        }
                    }]
                });

                firebase.database().ref(`ships/${data.ship}/${key}/key`).set(key).then(() => {
                    reportLoad.dismiss().then(() => {
                        confirmation.present();
                    });
                });
                this.makeShipMarkers(shipData);
            });
        });
    }
    getArrive(hours){
        var now = Date.now();
        return now + 1000 * 60 * 60 * hours;
    }
    ngAfterViewInit() {    
        if(this.navParams.get('id')){
            this.events.publish('deeplink');
        } 
        //checks if this is NOT the first time you're opening up the map
        if (this.userInfo.zoom != null) {
            //initializes map
            let latLng;
            latLng = new google.maps.LatLng(this.userInfo.lat, this.userInfo.lng);
            let options = {
                center: latLng,
                zoom: this.userInfo.zoom,
                disableDefaultUI: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            this.initMap(options, false);

            return;
        }
        //if this is the first time opening up maps then run this function
        this.runNavigation();
    }
    doShare(){
        this.mapPage.shareShow = true;
    }
    getName(c_name){
        var name = "";
        switch (c_name) {
            case 'faj':
                name = "Fajardo";
                break;
            case 'vq':
                name = "Vieques";
                break;
            case 'cul':
                name = "Culebra";
                break;
            case 'cei':
                name = "Ceiba";
                break;
            default:
                break;
        }
        return name;
    }
    getTime(){
        var myTime = new Date(this.myActiveShipData.date).toLocaleTimeString();
        return myTime;
    }
    shipName(){
        if(!this.myActiveShipData) return "";

        var shipName = "Cayo Blanco";
        switch(this.myActiveShipData.ship){
            case 'ship1':
                shipName = "Cayo Blanco"
                break;
            case 'ship2':
                shipName = "Cayo Largo"
                break;
            case 'ship3':
                shipName = "Cayo Norte"
                break;
            case 'ship4':
                shipName = "Isleño"
                break;
            case 'ship5':
                shipName = "Schoodic Explorer";
                break;
            case 'ship6':
                shipName = "Big Cat";
                break;
            case 'ship7':
                shipName = "Mr. Vean";
                break;
            case 'ship8':
                shipName = "Mr. Cade";
                break;
            default: 
                break;
        }
        return shipName
    }
    makeShipMarkers(data) {
        var color = "green";
        switch(data.ship){
            case 'ship1':
                color = 'green';
                break;
            case 'ship2':
                color = 'blue';
                break;
            case 'ship3':
                color = 'orange';
                break;
            case 'ship4':
                color = 'yellow';
                break;
            case 'ship5':
                color = 'purple';
                break;
            case 'ship6':
                color = 'pink';
                break;
            case 'ship7':
                color = 'aqua';
                break;
            case 'ship8':
                color = 'black';
                break; 
            default:
                break;
        }
        var difference = Date.now() - data.date;
        if(difference > 1000 * 90 * 60){return}
        else if(difference > 1000 * 50 * 60){color = "gray"};

        var image = {
            url: `assets/images/icons/ship_${color}.png`,
            size: new google.maps.Size(40, 40),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(15, 15),
            scaledSize: new google.maps.Size(30, 30),
        };
        var end = this.getEndLocation(data.end);
        
        var latLng;
        var hour2 = 1000 * 120 * 60;
        if(data.arrival){
            hour2 = data.arrival - data.date;
        }
        if(difference < hour2){
            var lat = data.lat + ((end.lat - data.lat) * difference / hour2);
            var lng = data.lng + ((end.lng - data.lng) * difference / hour2);
            latLng = new google.maps.LatLng(lat, lng);
        }else{
            latLng = new google.maps.LatLng(end.lat, end.lng);
        }
        var pathCoordinates1 = [
            { lat: data.lat, lng: data.lng },
            { lat: latLng.lat(), lng: latLng.lng() }
        ];
        var pathCoordinates2 = [
            { lat: latLng.lat(), lng: latLng.lng() },
            { lat: end.lat, lng: end.lng }
        ];
        
        var marker = new google.maps.Marker({
            position: latLng,
            icon: image,
            map: this.map,
            zIndex: 100
        });
        var self = this;
        google.maps.event.addListener(marker, 'click', function (e) {
            self.openShip(data, marker);
        });
        if(difference < hour2){
            new google.maps.Polyline({
                path: pathCoordinates2,
                geodesic: true,
                strokeColor: '#888888',
                strokeOpacity: 1.0,
                strokeWeight: 2,
                map: this.map,
                zIndex: 99
            });
            new google.maps.Polyline({
                path: pathCoordinates1,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2,
                map: this.map,
                zIndex: 99
            });
        }
    }
    getEndLocation(c_end){
        var end = {
            lat: 0, lng: 0
        };
        switch (c_end) {
            case 'faj':
                end = {
                    lat: 18.334442,
                    lng: -65.631465
                }
                break;
            case 'vq':
                end = {
                    lat: 18.152701,
                    lng: -65.444698
                }
                break;
            case 'cul':
                end = {
                    lat: 18.30123,
                    lng: -65.30251
                }
                break;
            case 'cei':
                end = {
                    lat: 18.22694,
                    lng: -65.60559
                }
                break;
            default:
                break;
        }
        return end;
    }
    openShip(data, marker) {
        this.deactivate = true; 
        this.myActiveShipData = data; 
        this.shipDrop = true;
        this.dropDown = false;
        this.userInfo.activeShipData = data;
        if (!this.userInfo.activeShipData.likes) {
            this.userInfo.activeShipData.likes = 0;
        }
        this.likeValue = false;
        this.likeable(true);
        this.checkLikes(this.myActiveShipData.key, `ships/${data.ship}`);
        this.myActiveMarker = marker;
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
        this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((position) => {
            let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            self.map.setCenter(latLng);
            self.map.setZoom(17);
            //self.myOptions.center = latLng;
            if (self.myOptions == undefined) {
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
            } else {
                self.myOptions.center = latLng;
            }
            if (self.myMarker) {
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
        if (this.map.getZoom() <= 12) {
            this.myMarker.setVisible(false);
            this.myCircle.setVisible(false);
        }
        this.animate(latLng);
    }
    runNavigation() {
        var self = this;

        //check if the user will let you see their position
        this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then(function (position) {
            if(!position || position == undefined){
                self.doDefaultLocation(self);
                return;
            }
            self.userInfo.allowPosition = true;
            let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            let options = {
                center: latLng,
                zoom: 17,
                disableDefaultUI: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            self.initMap(options, true);
        }).catch(function () {
            self.doDefaultLocation(self);
        });
    }
    doDefaultLocation(self){
        let latLng = new google.maps.LatLng(18.318407, -65.296514);
        let options = {
            center: latLng,
            zoom: 12,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        self.initMap(options, false);
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
    presentImage(myImage) {
        let imageViewer = this.imageViewerCtrl.create(myImage);
        imageViewer.present();
    }
    //runs if the map is touched
    //removes info drop down
    mapTouch() {
        this.dropDown = false;
        this.shipDrop = false;
        this.userInfo.activeData = {};
    }
    zoom(direction){
        this.map.setZoom(this.map.getZoom() + direction);
    }
    translateStatus(status) {
        //console.log(status);
        switch (status) {
            case 'Complete':
                return this.translate.text.other.complete;
            case 'To Do':
                return this.translate.text.other.todo;
            default:
                break;
        }
    }
    translateType(type) {
        switch (type) {
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
                return type;
        };
    }
    ////////////////////////////////////////////////////////////////////////////////////////
    likeable(ship) {
        var self = this;
        var key;
        if(ship){
            key = this.userInfo.activeShipData.key;
        }else{
            key = this.userInfo.activeData.key;
        }
        this.likeProvider.likeable(ship, key, function (value) {
            //ngZone.run updates the DOM otherwise change is not visible
            self.ngZone.run(() => {
                if (value == 0 || value == -1) {
                    self.likeValue = false;
                }
                else {
                    self.likeValue = true;
                }
                self.deactivate = false;
            });
        });
    }
    like(ship) {
        this.deactivate = true;
        var self = this;
        var key;
        var shipType = '';
        if(ship){
            key = this.userInfo.activeShipData.key
            shipType = this.userInfo.activeShipData.ship;
        }else{
            key = this.userInfo.activeData.key
        }
        this.likeProvider.like(ship, shipType, key, function (val) {
            if (val > 99) val = 99;
            self.likes = val;
            self.likeable(ship);
            self.deactivate = false;
        })
    }
    ////////////////////////////////////////////////////////////////////////////////////////
    openChat(ship) {
        if(!this.afAuth.auth.currentUser){
            this.menuCtrl.close(); 
            this.events.publish('login:open');
            return;
        }
        this.mapPage.shipChat = ship;
        this.mapPage.infoShow = true;
        this.mapPage.mapState = "comment";
    }
    openResolve() {
        if(!this.afAuth.auth.currentUser){
            this.menuCtrl.close(); 
            this.events.publish('login:open');
            return;
        }
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
        if (data.status == "To Do") {
            selection += ".png";
        } else {
            selection += "_gray.png";
        }
        var image = {
            url: selection,
            size: new google.maps.Size(40, 40),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(15, 15),
            scaledSize: new google.maps.Size(30, 30),
        };

        //creates the marker with the specified icon
        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(data.lat, data.lng),
            icon: image,
            map: this.map
        });
        this.markers.push(marker);
        var self = this;
        if (this.map.getZoom() <= 12) {
            marker.setVisible(false);
            this.showButtons = false;
        }
        /*Allows an info window to pop up when a point is clicked*/
        google.maps.event.addListener(marker, 'click', function (e) {
            self.doOpen(data, marker);
            self.events.publish('position:open', {});
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
    doOpen(data: any, marker?: any) {
        if(!data || data == undefined) return;
        this.deactivate = true;
        this.myActiveData = data;
        this.dropDown = true;
        this.shipDrop = false;
        // self.distance = geolib.getDistance(
        //     {latitude: marker.getPosition().lat(), longitude: marker.getPosition().lng()},
        //     {latitude: self.myMarker.getPosition().lat(), longitude: self.myMarker.getPosition().lng()})/1000;
        //self.mapPage.infoShow = true;
        this.userInfo.activeData = data;
        if (!this.userInfo.activeData.likes) {
            this.userInfo.activeData.likes = 0;
        }
        this.likeValue = false;
        this.likeable(false);
        this.checkLikes(this.myActiveData.key, 'positions');
        if(marker){
            this.myActiveMarker = marker;
        }
    }
    checkLikes(postId, pointType) {
        firebase.database().ref(`/${pointType}/${postId}/likes`).once('value', snapshot => {
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
        if(typeof(google) != undefined){
            this.map = new google.maps.Map(this.mapElement.nativeElement, options);
        }else{
            var myAlert = this.alertCtrl.create({
                title: "major error, google maps can't load",
                buttons: ["OK"]
            });
            myAlert.present();
            return;
        }
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
                            if (item.val().status != "Complete") {
                                self.heatMapData.push({ location: new google.maps.LatLng(item.val().lat, item.val().lng), weight: 100 });
                            }
                        });
                        self.heatMap = new google.maps.visualization.HeatmapLayer({
                            data: self.heatMapData,
                            map: self.map,
                            radius: 25,
                            maxIntensity: 250
                        });
                        if (self.map.getZoom() > 12) {
                            self.heatMap.setMap(null);
                        }
                        self.setOnce = false;

                    }
                });
                var ships = ['ship1', 'ship2', 'ship3', 'ship4', 'ship5', 'ship6', 'ship7', 'ship8'];
                ships.forEach(ship => {
                    firebase.database().ref(`ships/${ship}`).limitToLast(2).once('value').then(snapshot => {
                        snapshot.forEach(item => {
                            var shipData = {
                                ship: item.val().ship,
                                end: item.val().end,
                                start: item.val().start,
                                lat: item.val().lat,
                                lng: item.val().lng,
                                date: item.val().date,
                                name: item.val().name,
                                id: item.val().id,
                                likes: item.val().likes,
                                key: item.val().key
                            }
                            self.makeShipMarkers(shipData);                    
                        });
                    })
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
            self.mapTouch();
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
            if (this.map.getZoom() <= 12) {
                this.myMarker.setVisible(false);
                this.myCircle.setVisible(false);
            }
        }
        google.maps.event.addListener(this.map, 'click', function(e){
            self.mapTouch();
        })
        google.maps.event.addListener(this.map, 'zoom_changed', function (e) {
            self.mapTouch()
            if (self.myCircle == undefined || !self.myCircle || self.myCircle == null) return;
            var zoom = self.map.getZoom();
            if (zoom > 12) {
                self.myMarker.setVisible(true);
                self.myCircle.setVisible(true);
                if (self.heatMap) self.heatMap.setMap(null);
            }
            else {
                self.myMarker.setVisible(false);
                self.myCircle.setVisible(false);
                if (self.heatMap) self.heatMap.setMap(self.map);
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
