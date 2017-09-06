//Ionic imports
import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, MenuController} from 'ionic-angular';
// import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation';

//page imports
import { AddPage } from '../../pages/add/add';
import { ConfirmationPage } from '../../pages/confirmation/confirmation'
import { InfoWindowPage } from '../../pages/info-window/info-window';
import { SettingsPage } from '../../pages/settings/settings';
import { DiscussionPage } from '../../pages/discussion/discussion';
import { FilterPage } from '../../pages/filter/filter';
import { MapPage } from '../../pages/map/map';

//provider imports
import { ZonesProvider } from '../../providers/zones/zones';
import { UserInfoProvider } from '../../providers/user-info/user-info';
import { TranslatorProvider } from '../../providers/translator/translator';
import { LikeProvider } from '../../providers/like/like';
import { ClickProvider } from '../../providers/click/click';

//firebase imports
import { AngularFireDatabase} from 'angularfire2/database';
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
   add: boolean = false;
   infoWindow: any = null;
   setOnce: boolean = true;
   showButtons: boolean = true;
   geoMarker: any;
   points: any = [];
   zonies: any = [];
   markers: any = [];
   heatMapData: any = [];

   myMarker: any = undefined;
   myCircle: any = undefined;
    myOptions: any = undefined;
    myDirection: any;
    orientationSub: any;

   dropDown: boolean = true;
   hybrid: boolean = false;
   likeValue: any = 0;
   
   myActiveData: any = {};
   type: any = '';
   myActiveMarker: any;
   
   /*Instantiate all imported classes*/
   constructor(public navCtrl: NavController, public navParams: NavParams, public modal: ModalController, public ngZone: NgZone, public fireDB: AngularFireDatabase, public afAuth: AngularFireAuth,public alertCtrl: AlertController, public zones: ZonesProvider, public menuCtrl: MenuController,public userInfo: UserInfoProvider, public translate: TranslatorProvider,public likeProvider: LikeProvider, public click: ClickProvider, public mapPage: MapPage) {
        mapPage.mapView = this;
                    
   }
    ngAfterViewInit() {

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
            },null,{enableHighAccuracy: true, maximumAge:3000, timeout: 5000});
        }
        return;
    }
    //if this is the first time opening up maps then run this function
    this.runNavigation();
    }
   toggleMap(){
       this.click.click('mapToggleMap');
       this.hybrid = !this.hybrid;
       if(this.hybrid){
           this.map.setMapTypeId(google.maps.MapTypeId.HYBRID);
           this.map.setTilt(0);
       }
       else{
           this.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
       }
   }
   edit(){
       return this.userInfo.mapEdit;
   }
   editTrue(){
       this.click.click('mapEditTrue');
       this.userInfo.mapEdit = true;
       this.navCtrl.setRoot(MapPage);
   }
   //called when user likes a post
   like(value){
       this.click.click('mapLike');
       var self = this;
       this.likeProvider.like(this.myActiveData.key, value, function(likes){
           //updates post locally with callback function
           self.myActiveData.likes = likes;
       });
       this.likeValue = value;
   }
   //used for style, checks user's like preference on any given report
   likeable(){
       var self = this;
       this.likeProvider.likeable(this.myActiveData.key, function(value){
           //ngZone.run updates the DOM otherwise change is not visible
           self.ngZone.run(() =>{
               self.likeValue = value;   
           })
       });
   }
   setCenter(){
       this.click.click('mapSetCenter');
       var self = this;
       //check if the user is allowing you to see their position
       navigator.geolocation.getCurrentPosition((position) => {
           let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
           self.map.setCenter(latLng);
           self.map.setZoom(17);
           self.myOptions.center = latLng;
           self.myMarker.setPosition(latLng);
       }, null, {enableHighAccuracy: true, maximumAge:3000, timeout: 5000});
   }
   //sets personal marker and circle
   setPin(latLng){
       if(this.myCircle != null){
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
       },{enableHighAccuracy: true, maximumAge:3000, timeout: 5000});
   }
   //any time the "menu" button is clicked
   openMenu(){
       this.click.click('mapMenu');
       this.menuCtrl.open();
   }
   openFilter(){
       this.click.click('mapFilter');
       var filterPage = this.modal.create(FilterPage, {target: 'map'});
       filterPage.onDidDismiss(data => {
           if(data){
               this.navCtrl.setRoot(MapPage);
           }
       })
       filterPage.present();
   }
   //deprecated
   openSettings(){
       this.navCtrl.push(SettingsPage);
   }
   /*Toggle add and update DOM*/
   doAdd(){
       this.mapPage.addShow = true;
   }
   addFalse(){
       this.add = false;
       this.ngZone.run(() =>{
       });
   }
   dropFalse(){
       this.dropDown = true;
   }
   submitReport(data){
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
    var date = (today.getMonth()+1) + "-" + today.getDate() + "-" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    newMarker.date = date;

    /*Push point to firebase and give it a reference*/
    var key = this.fireDB.list('positions').push(newMarker).key;
    this.fireDB.object('positions/'+key +'/key').set(key);
    newMarker.key = key;
    this.makeMarker(newMarker);
    
    //update # of posts
    var userRating = firebase.database().ref('/userRating/').child(this.afAuth.auth.currentUser.uid)
    userRating.once('value', snap => {
        if(!snap.hasChild('posts')){
            userRating.child('posts').set(1);
        }else{
            userRating.child('posts').set(snap.val().posts + 1);
        }
    }).then(_ => {
        data.loader.dismiss();
        data.share();
    });
   }
   addPage(data){
       this.click.click('mapAdd'+data);
       let title = "";
       let description = "";
       
       //switch for message to show user when they click on add button
       switch(data){
           case 'building':
               title = this.translate.text.map.buildingTitle;
               description = this.translate.text.map.buildingDescription;
               break;
           case 'bugs':
               title = this.translate.text.map.bugsTitle;
               description = this.translate.text.map.bugsDescription;
               break;
           case 'pest':
               title = this.translate.text.map.pestsTitle;
               description = this.translate.text.map.pestsDescription;
               break;
           case 'trash':
               title = this.translate.text.map.trashTitle;
               description = this.translate.text.map.trashDescription;
               break;
           case 'cnd':
               title = this.translate.text.map.cndTitle;
               description = this.translate.text.map.cndDescription;
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
                   text: this.translate.text.map.ok,
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
                                       name: this.afAuth.auth.currentUser.displayName,
                                       id: this.afAuth.auth.currentUser.uid,
                                       url: data.url,
                                       refName: data.refName,
                                       status: "To Do",
                                       key: "",
                                       date: "",
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
                                       name: this.afAuth.auth.currentUser.displayName,
                                       id: this.afAuth.auth.currentUser.uid,
                                       status: "To Do",
                                       key: "",
                                       date: "",
                                   }
                               }
                               var today = new Date();
                               var date = (today.getMonth()+1) + "-" + today.getDate() + "-" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                               newMarker.date = date;
                               /*Push point to firebase and give it a reference*/
                               var key = this.fireDB.list('positions').push(newMarker).key;
                               this.fireDB.object('positions/'+key +'/key').set(key);
                               newMarker.key = key;
                               this.makeMarker(newMarker);
                               let confirm = this.modal.create(ConfirmationPage, newMarker);
                               
                               //update # of posts
                               var self = this;
                               var userRating = firebase.database().ref('/userRating/').child(self.afAuth.auth.currentUser.uid)
                               userRating.once('value', snap => {
                                   if(!snap.hasChild('posts')){
                                       userRating.child('posts').set(1);
                                   }else{
                                       userRating.child('posts').set(snap.val().posts + 1);
                                   }
                               });
                               
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
                   text: this.translate.text.map.cancel,
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
           default:
               selection = 'assets/images/icons/bug.png';
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
           self.mapPage.infoShow = !self.mapPage.infoShow;
           self.userInfo.activeData = data;
           if(!self.userInfo.activeData.likes){
            self.userInfo.activeData.likes = 0;
           }
           //translate data type
           switch(data.type){
               case 'bugs':
                   self.type = self.translate.text.other.bug;
                   break;
               case 'building':
                   self.type = self.translate.text.other.building;
                   break;
               case 'trash':
                   self.type = self.translate.text.other.trash;
                   break;
               case 'pest':
                   self.type = self.translate.text.other.pest;
                   break;
               case 'cnd':
                   self.type = self.translate.text.other.cnd;
                   break;
           }
           self.myActiveMarker = marker;
           self.likeable();
           self.dropDown = false;
       });
       google.maps.event.addListener(this.map, 'zoom_changed', function(e){
           var zoom = self.map.getZoom();
           if(zoom > 12){
               marker.setVisible(true);
               self.showButtons = true;
           }
           else{
               marker.setVisible(false);
               self.showButtons = false;
           }
       })
   }
   //open up a chat modal
   doChat(){
       this.click.click('mapChat');
       let chatModal = this.modal.create(DiscussionPage, {id: this.myActiveData.key});
       chatModal.present();
   }
   //pull up info window
   doInfoWindow(){
       this.click.click('mapInfoWindow');
       let infoModal = this.modal.create(InfoWindowPage, {data: this.myActiveData});
       //if on did dismiss says to delete data, refresh page and remove marker
       infoModal.onDidDismiss(callBack => {
           if(callBack){
               this.myActiveMarker.setMap(null);
               this.myActiveMarker = null;
               this.navCtrl.setRoot(MapPage);
           }
       });
       infoModal.present();
   }
   //make sure each point passes filter
   checkPoint(item){
       if(!this.userInfo.filter) return true;
       let check = false;
       
       //filter by type
       for(var i = 0; i < this.userInfo.filter.type.length; i++){
           if(item.type == this.userInfo.filter.type[i]){
               check = true;
               break;
           }
       }
       if(!check) return false;
       check = false;
       
       //fileter by status
       for(i = 0; i < this.userInfo.filter.status.length; i++){
           if(item.status == this.userInfo.filter.status[i]){
               check = true;
               break;
           }
       }
       if(!check) return false;   
       if(!item.likes){
           item.likes = 0;
       }
       //filter by rating
       if(item.likes <= this.userInfo.filter.upper &&
         item.likes >= this.userInfo.filter.lower){
           return true;
       }
       return false;
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
                   //filter points and create markers
                   snaps.forEach(function(item){
                       if(!self.checkPoint(item.val())) return;
                       self.makeMarker(item.val());
                       self.points.push(item.val());
                       self.heatMapData.push({location: new google.maps.LatLng(item.val().lat,item.val().lng), weight: 100});
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
           let latLng = new google.maps.LatLng(this.map.getCenter().lat(),this.map.getCenter().lng());
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
           google.maps.event.addListener(this.map, 'zoom_changed', function(e){
            var zoom = self.map.getZoom();
            if(zoom > 12){
                self.myMarker.setVisible(true);
                self.myCircle.setVisible(true);
            }
            else{
                self.myMarker.setVisible(false);
                self.myCircle.setVisible(false);
            }
        })
       }
   }
   //any "cluster" zone that is found on the map is drawn here
   applyZones(zones, radius, color){

   }
   //animates the user's position
   animate(latLng){
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
       setInterval(function(){
           if(self.myOptions.radius > 150){
            self.myOptions.radius = 0;
               skip = true;
           }
           if(!skip){
            self.myOptions.strokeOpacity = (150-self.myOptions.radius)/150;
            self.myOptions.fillOpacity = (150-self.myOptions.radius)/150;
           }
           //fun little formula to make the circle's delta radius decrease at an inverse
           //exponential rate overtime
           self.myOptions.radius += Math.pow((320-self.myOptions.radius)/150, 2)/3;
           self.myCircle.setOptions(self.myOptions);     
           skip = false;
       },30)
   }
}
