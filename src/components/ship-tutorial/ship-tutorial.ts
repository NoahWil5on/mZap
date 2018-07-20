import { Component, ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';

//page imports
import { MapPage } from '../../pages/map/map';

//provider imports
import { TranslatorProvider } from '../../providers/translator/translator';

@Component({
  selector: 'ship-tutorial',
  templateUrl: 'ship-tutorial.html'
})
export class ShipTutorialComponent {
    @ViewChild(Slides) slides: Slides;

    pages: any = [];

  constructor(public mapPage: MapPage, public translate: TranslatorProvider) {
    this.pages.push({
        text: this.translate.text.shipTutorial.help1,
        src: "assets/images/ship_tutorial/ferries.PNG"
      });
      this.pages.push({
        text: this.translate.text.shipTutorial.help2,
        src: "assets/images/ship_tutorial/markLocation.PNG"
      });
      this.pages.push({
        text: this.translate.text.shipTutorial.help3,
        src: "assets/images/ship_tutorial/create.PNG"
      });
      this.pages.push({
        text: this.translate.text.shipTutorial.help4,
        src: "assets/images/ship_tutorial/clickMarker.PNG"
      });
      this.pages.push({
        text: this.translate.text.shipTutorial.help5,
        src: "assets/images/ship_tutorial/start.PNG"
      });
      this.pages.push({
        text: this.translate.text.shipTutorial.help6,
        src: "assets/images/ship_tutorial/gray.PNG"
      });
      this.pages.push({
        text: this.translate.text.shipTutorial.help7,
        src: "assets/images/ship_tutorial/location.PNG"
      });
    }
    skip(){
      if(this.slides.isEnd()){
        this.mapPage.shipTut = false;
      }
      this.slides.slideNext();
    }
}
