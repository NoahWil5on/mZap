import { Component } from '@angular/core';

//page imports
import { MapPage } from '../../pages/map/map';

@Component({
  selector: 'tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialComponent {

  constructor(public mapPage: MapPage) {

  }
  skip(){

  }
}
