import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';

//page imports
import { MapPage } from '../../pages/map/map';

//provider imports 
import { TranslatorProvider } from '../../providers/translator/translator';

@Component({
  selector: 'thanks',
  templateUrl: 'thanks.html'
})
export class ThanksComponent {
  @ViewChild('main') main;

  constructor(public mapPage: MapPage, public translate: TranslatorProvider, public navCtrl: NavController) {

  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.main.nativeElement.style.transform = "translate(-50%,-50%)";
    }, 10);
  }

  closeOut() {
    this.navCtrl.setRoot(MapPage);
  }
}
