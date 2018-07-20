import { Component, ViewChild } from '@angular/core';
import { MapPage } from '../../pages/map/map';
import { Events, AlertController } from 'ionic-angular';

import { TranslatorProvider } from '../../providers/translator/translator';

import * as firebase from 'firebase';

@Component({
  selector: 'ferry-rating',
  templateUrl: 'ferry-rating.html'
})
export class FerryRatingComponent {
    @ViewChild('main') main;

    constructor(public mapPage: MapPage) {
        setTimeout(() => {
            this.main.nativeElement.style.transform = "translate(-50%,-50%)";
        }, 10);
    }
    closeOut() {
        this.mapPage.ferryRatingShow = false;
    }

}
