import { Component, ViewChild } from '@angular/core';
import {Slides, LoadingController} from 'ionic-angular';

//page imports
import { MapPage } from '../../pages/map/map';

//provider imports 
import { UserInfoProvider } from '../../providers/user-info/user-info';
import { TranslatorProvider } from '../../providers/translator/translator';
import { ImagesProvider } from '../../providers/images/images';

//firebase imports
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'add',
  templateUrl: 'add.html'
})
export class AddComponent {
  @ViewChild(Slides) slide: Slides;
  @ViewChild('preview') preview; 

  dataSet:boolean = false;
  type: any = undefined;
  desc: string = "";
  show: boolean = true;
  url: any = "";
  refName: any = "";

  constructor( public mapPage: MapPage, public translate: TranslatorProvider, public userInfo: UserInfoProvider, public afAuth: AngularFireAuth, public images: ImagesProvider, public loadingCtrl: LoadingController ) {

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
    if(this.slide.getActiveIndex() == 3){
      this.doSubmit();
    }
    this.slide.slideNext(500,null);
  }
  doSubmit(){
    var loader = this.loadingCtrl.create({
      content: "Submtting Post..."
    });
    loader.present();
    var promiseObj = this.images.uploadToFirebase();
    promiseObj.promise.then(res => {
      this.url = res;
      this.refName = promiseObj.refName;
    }).then(() => {   
      this.mapPage.mapView.submitReport({
        refName: this.refName,
        url: this.url,
        show: this.show,
        type: this.type,
        desc: this.desc,
        loader: loader,
      });
    })
  }
  runCheck(slide){
    if(slide == 1){
      if(!this.dataSet) return false;
    }
    if(this.slide.getActiveIndex() != slide) return false;
    return true;
  }
  submit(){
    if(this.dataSet && this.type != undefined){
      return true;
    }
    return false;
  }
}
