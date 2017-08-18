import { Component } from '@angular/core';
import { MapPage } from '../../pages/map/map';

@Component({
  selector: 'info',
  templateUrl: 'info.html'
})
export class InfoComponent {

  state: any = 'info';
  constructor( public mapPage: MapPage ) {

  }
  checkState(state){
    return state == this.state;
  }
  updateState(state){
    this.state = state;
  }
  closeOut(){
    this.mapPage.infoShow = false;
  }
}
