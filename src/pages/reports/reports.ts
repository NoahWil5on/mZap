import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { TranslatorProvider } from '../../providers/translator/translator';

/**
 * Generated class for the ReportsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html',
})
export class ReportsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, public translate: TranslatorProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportsPage');
  }
    openMenu(){
        this.menuCtrl.open();
    }

}
