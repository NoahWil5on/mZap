//Ionic imports
import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams, ModalController, MenuController, Events } from 'ionic-angular';
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
    constructor(public navCtrl: NavController, public navParams: NavParams, public modal: ModalController, public ngZone: NgZone, public fireDB: AngularFireDatabase, public afAuth: AngularFireAuth, public zones: ZonesProvider, public menuCtrl: MenuController, public userInfo: UserInfoProvider, public translate: TranslatorProvider, public likeProvider: LikeProvider, public click: ClickProvider, public mapPage: MapPage, public events: Events) {
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
                navigator.geolocation.getCurrentPosition((position) => {
                    let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    self.setPin(latLng);
                }, null, { enableHighAccuracy: true, maximumAge: 3000, timeout: 5000 });
            }
            return;
        }
        //if this is the first time opening up maps then run this function
        this.runNavigation();
    }
    toggleMap() {
        this.click.click('mapToggleMap');
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
        this.click.click('mapSetCenter');
        var self = this;
        //check if the user is allowing you to see their position
        navigator.geolocation.getCurrentPosition((position) => {
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
        }, null, { enableHighAccuracy: true, maximumAge: 3000, timeout: 5000 });
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
            map: this.map
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
        this.animate(latLng);
    }
    runNavigation() {
        var self = this;

        //check if the user will let you see their position
        navigator.geolocation.getCurrentPosition(function (position) {
            self.userInfo.allowPosition = true;
            let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            let options = {
                center: latLng,
                zoom: 17,
                disableDefaultUI: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            self.initMap(options, true);
        }, function () {
            let latLng = new google.maps.LatLng(18.318407, -65.296514);
            let options = {
                center: latLng,
                zoom: 12,
                disableDefaultUI: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            self.initMap(options, false);
        }, { enableHighAccuracy: true, maximumAge: 3000, timeout: 5000 });
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
            date: "",
        }
        var today = new Date();
        var date = (today.getMonth() + 1) + "-" + today.getDate() + "-" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        newMarker.date = date;

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
    /*Is called anytime a point is found in the database or created*/
    makeMarker(data) {
        var selection = '';

        //switch for positions markers around the map
        //tells google what image to use as the marker
        switch (data.type) {
            case 'bugs':
                selection = 'assets/images/icons/bug.png';
                break;
            case 'trash':
                selection = 'assets/images/icons/trash.png';
                break;
            case 'building':
                selection = 'assets/images/icons/building.png';
                break;
            case 'pest':
                selection = 'assets/images/icons/pest.png';
                break;
            case 'cnd':
                selection = 'assets/images/icons/cnd.png';
                break;
            case 'water':
                selection = 'assets/images/icons/droplet.png';
                break;
            case 'road':
                selection = "assets/images/icons/road.png";
                break;
            case 'electricity':
                selection = "assets/images/icons/electricity.png";
                break;
            case 'tree':
                selection = "assets/images/icons/tree.png";
                break;
            case 'rocked':
                selection = "assets/images/icons/blocked_road.png";
                break;
            default:
                selection = 'assets/images/icons/bug.png';
                break;
        };
        //creates the marker with the specified icon
        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(data.lat, data.lng),
            icon: selection,
            map: this.map
        });
        this.markers.push(marker);
        var self = this;
        /*Allows an info window to pop up when a point is clicked*/
        google.maps.event.addListener(marker, 'click', function(e){
            self.myActiveData = data;
            self.mapPage.infoShow = true;
            self.userInfo.activeData = data;
            if(!self.userInfo.activeData.likes){
             self.userInfo.activeData.likes = 0;
            }
            self.myActiveMarker = marker;
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
                            self.heatMapData.push({ location: new google.maps.LatLng(item.val().lat, item.val().lng), weight: 100 });
                        });
                        self.heatMap = new google.maps.visualization.HeatmapLayer({
                            data: self.heatMapData,
                            map: self.map,
                            radius: 25,
                            maxIntensity: 250
                        });

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
        })
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
        google.maps.event.addListener(this.map, 'zoom_changed', function (e) {
            if(self.myCircle == undefined || !self.myCircle || self.myCircle == null) return;
            var zoom = self.map.getZoom();
            if (zoom > 12) {
                self.myMarker.setVisible(true);
                self.myCircle.setVisible(true);
            }
            else {
                self.myMarker.setVisible(false);
                self.myCircle.setVisible(false);
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
