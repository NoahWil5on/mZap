import { Component, ViewChild } from '@angular/core';
import {Slides} from 'ionic-angular';

import { MapPage } from '../../pages/map/map';

//provider imports 
import { UserInfoProvider } from '../../providers/user-info/user-info';
import { TranslatorProvider } from '../../providers/translator/translator';

//firebase imports
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'add',
  templateUrl: 'add.html'
})
export class AddComponent {
  @ViewChild(Slides) slide: Slides;
  @ViewChild('preview') preview; 

  states: any = ['type','pic','info','confirm','confirmation'];
  currentState: any = 0;
  dataSet:boolean = true;
  type: any = undefined;

  constructor( public mapPage: MapPage, public translate: TranslatorProvider, public userInfo: UserInfoProvider, public afAuth: AngularFireAuth ) {

  }
  checkState(state){
    return state == this.states[this.currentState];
  }
  updateState(change){
    this.currentState += change;
    if(this.currentState >= this.states.length){
      this.currentState = this.states.length-1;
    }
    else if (this.currentState < 0){
      this.currentState = 0;
    }
    console.log(this.states[this.currentState]);
  }
  closeOut(){
    this.mapPage.addShow = false;
  }
  loggedAuth(){
    return this.afAuth.auth.currentUser.uid == this.userInfo.activeData.id;
  }
  //sliding for resolved images
  slideLeft(){
    this.slide.slidePrev(500,null);
  }
  slideRight(){
    this.slide.slideNext(500,null);
  }
  runCheck(){
    if(!this.dataSet) return false;
    if(this.slide.getActiveIndex() != 1) return false;
    return true;
  }
}
