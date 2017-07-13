import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import {Camera} from '@ionic-native/camera';


@Injectable()
export class ImagesProvider {

    data: any;
  constructor(public camera: Camera) {

  }
    uploadToFirebase(){
        return new Promise((resolve,reject) => {
            var fileName = "sample-" + new Date().getTime() + ".png";
            firebase.storage().ref('/images/').child(fileName).putString(this.data, 'base64', {contentType: 'image/png'}).then((data) => {
                resolve(data.downloadURL+"");
            }).catch((e) => {
                reject(e);
            });
        });
    }
    doGetCameraImage(){
        //get picture from camera
        return new Promise((resolve,reject) =>{ 
            this.camera.getPicture({
                quality : 9100,
                destinationType : this.camera.DestinationType.DATA_URL,
                sourceType : this.camera.PictureSourceType.CAMERA,
                allowEdit : true,
                encodingType: this.camera.EncodingType.PNG,
                targetWidth: 100,
                targetHeight: 100
            }).then((imageData) => {
                this.data = imageData;
                resolve();
            }, (_error) => {
            });
        });
    }
    doGetAlbumImage(){
        //get picture from camera
        return new Promise((resolve,reject) =>{ 
            this.camera.getPicture({
                quality : 100,
                destinationType : this.camera.DestinationType.DATA_URL,
                sourceType : this.camera.PictureSourceType.SAVEDPHOTOALBUM,
                allowEdit : true,
                encodingType: this.camera.EncodingType.PNG,
                targetWidth: 100,
                targetHeight: 100
            }).then((imageData) => {
                this.data = imageData;
                resolve();
            }, (_error) => {
            });
        });
    }
}
