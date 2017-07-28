//vanilla ionic imports
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

//provider imports
import { TranslatorProvider } from '../../providers/translator/translator';

@IonicPage()
@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html',
})
export class ReportsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, public translate: TranslatorProvider) {
  }

  ionViewDidLoad() {
  }
    //open nav menu
    openMenu(){
        this.menuCtrl.open();
    }

}
