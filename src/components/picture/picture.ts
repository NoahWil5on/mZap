import { Component } from '@angular/core';

import { ImagesProvider } from '../../providers/images/images';
import { TranslatorProvider } from '../../providers/translator/translator';

import { AddComponent } from '../add/add';

@Component({
  selector: 'picture',
  templateUrl: 'picture.html'
})
export class PictureComponent {

  imageData: any = "";
  dataSet: boolean = false;

  constructor(public images: ImagesProvider, public translate: TranslatorProvider, public add: AddComponent) {

  }
  //get image from camera and set dataSet to true
  cameraRequest(){
    var promise = this.images.doGetCameraImage(600,600);
    promise.then(res => {
        this.imageData = "data:image/jpg;base64,"+res;
        this.add.dataSet = true; 
        setTimeout(() => {
            this.add.preview.nativeElement.setAttribute('src', this.imageData); 
        },500) 
    }).catch(e => {
    });
}
//get image from user album and set dataSet to true
albumRequest(){
    var promise = this.images.doGetAlbumImage(600,600);
    promise.then(res => {
        this.imageData = "data:image/jpg;base64,"+res;
        this.add.dataSet = true; 
        setTimeout(() => {
            this.add.preview.nativeElement.setAttribute('src', this.imageData); 
        },500)      
    }).catch(e => {
    });
}
}
