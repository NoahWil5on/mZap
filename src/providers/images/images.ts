import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import {Camera} from '@ionic-native/camera';


@Injectable()
export class ImagesProvider {

    data: any;
  constructor(public camera: Camera) {

  }
    uploadToFirebase(){
        var fileName = "sample-" + new Date().getTime() + ".png";
        return {
            promise: new Promise((resolve,reject) => {
                    firebase.storage().ref('/images/').child(fileName).putString(this.data, 'base64', {contentType: 'image/png'}).then((data) => {
                        resolve(data.downloadURL);
                    }).catch((e) => {
                        reject(e);
                    })            
                }),
            refName: fileName
        };
    }
    doGetCameraImage(){
        //get picture from camera
        return new Promise((resolve,reject) =>{ 
            this.camera.getPicture({
                quality : 100,
                destinationType : this.camera.DestinationType.DATA_URL,
                sourceType : this.camera.PictureSourceType.CAMERA,
                allowEdit : true,
                encodingType: this.camera.EncodingType.PNG,
                targetWidth: 400,
                targetHeight: 200
            }).then((imageData) => {
                this.data = imageData;
                resolve();
            }, (_error) => {
                reject(_error);
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
                targetWidth: 400,
                targetHeight: 200
            }).then((imageData) => {
                this.data = imageData;
                resolve();
            }, (_error) => {
                reject(_error);
            });
        });
    }
}
