import { Component, ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';

//page imports
import { MapPage } from '../../pages/map/map';

//provider imports
import { TranslatorProvider } from '../../providers/translator/translator';

@Component({
  selector: 'resolve-tutorial',
  templateUrl: 'resolve-tutorial.html'
})
export class ResolveTutorialComponent {
    @ViewChild(Slides) slides: Slides;

    pages: any = [];

  constructor(public mapPage: MapPage, public translate: TranslatorProvider) {
    this.pages.push({
        text: this.translate.text.resolveTutorial.help1,
        src: "assets/images/resolve_tutorial/fix.png"
      });
      this.pages.push({
        text: this.translate.text.resolveTutorial.help2,
        src: "assets/images/resolve_tutorial/make.png"
      });
      this.pages.push({
        text: this.translate.text.resolveTutorial.help3,
        src: "assets/images/resolve_tutorial/see.png"
      });
      this.pages.push({
        text: this.translate.text.resolveTutorial.help4,
        src: "assets/images/resolve_tutorial/gray.png"
      });
    }
    skip(){
      if(this.slides.isEnd()){
        this.mapPage.resolveTut = false;
      }
      this.slides.slideNext();
    }
}
