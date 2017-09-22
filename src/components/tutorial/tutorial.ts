import { Component, ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';

//page imports
import { MapPage } from '../../pages/map/map';

//provider imports
import { TranslatorProvider } from '../../providers/translator/translator';

@Component({
  selector: 'tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialComponent {
  @ViewChild(Slides) slides: Slides;

  types: any = [];

  constructor(public mapPage: MapPage, public translate: TranslatorProvider) {
    this.types.push({
      name: this.translate.text.other.trash,
      src: "assets/images/buttons/trash.png"
    });
    this.types.push({
      name: this.translate.text.other.pest,
      src: "assets/images/buttons/pest.png"
    });
    this.types.push({
      name: this.translate.text.other.building,
      src: "assets/images/buttons/building.png"
    });
    this.types.push({
      name: this.translate.text.other.bug,
      src: "assets/images/buttons/bug.png"
    });
    this.types.push({
      name: this.translate.text.other.cnd,
      src: "assets/images/buttons/cnd.png"
    });
    this.types.push({
      name: this.translate.text.other.water,
      src: "assets/images/buttons/droplet.png"
    });
    this.types.push({
      name: this.translate.text.other.road,
      src: "assets/images/buttons/road.png"
    });
    this.types.push({
      name: this.translate.text.other.tree,
      src: "assets/images/buttons/tree.png"
    });
    this.types.push({
      name: this.translate.text.other.rocked,
      src: "assets/images/buttons/blocked_road.png"
    });
    this.types.push({
      name: this.translate.text.other.electricity,
      src: "assets/images/buttons/electricity.png"
    });
  }
  skip(){
    if(this.slides.isEnd()){
      this.mapPage.tut = false;
    }
    this.slides.slideNext();
  }
}
