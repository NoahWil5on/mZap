//Ionic imports
import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  infoShow: boolean = false;
  addShow: boolean = false;
  mapView: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

}

