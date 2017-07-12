import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController} from 'ionic-angular';
import { AddPage } from '../add/add';
import { AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';

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
  constructor(public navCtrl: NavController, public navParams: NavParams, public modal: ModalController,
             public ngZone: NgZone, public fireDB: AngularFireDatabase) {
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
                    email: data.email
                }
                this.fireDB.list('positions').push(newMarker);
                this.makeMarker(newMarker);
            }
        });
        addModal.present();
    }
    async makeMarker(data){
        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(data.lat,data.lng),
            map: this.map
        });
        var self = this;
        google.maps.event.addListener(marker, 'click', function(e){
            if(self.infoWindow)
                self.infoWindow.close();
            self.makeInfoWindow(data);
            self.infoWindow.open(self.map,marker);
        });
    }

    makeInfoWindow(data){
        if(this.infoWindow){
            this.infoWindow.close();
        }
        var contentString = "";
        contentString += "<p>"+data.type+"</p>";
        contentString += "<p>"+data.title+"</p>";
        if(data.show){
            contentString += "<p>"+data.email+"</p>";
        }
        contentString += "<p>"+data.description+"</p>";
        
        this.infoWindow = new google.maps.InfoWindow({
            content: contentString
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
                snaps.forEach(function(item){
                    self.makeMarker(item.val());
                });
            });
        });
    }
}
