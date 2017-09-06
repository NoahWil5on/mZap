//Ionic imports
import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';

//provider imports
import { UserInfoProvider } from '../../providers/user-info/user-info';

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  infoShow: boolean = false;
  addShow: boolean = false;
  mapView: any;
  loginState: string = 'login';
  tut: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userInfo: UserInfoProvider) {
  }

}

