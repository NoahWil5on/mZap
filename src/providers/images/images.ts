//vanilla ionic imports
import { Injectable } from '@angular/core';
import {Camera} from '@ionic-native/camera';

//firebase imports
import * as firebase from 'firebase';


@Injectable()
export class ImagesProvider {

    data: any;
  constructor(public camera: Camera) {

  }
    //takes image and uploads it to firebase
    uploadToFirebase(){
        //gives the file an original name based on date and time
        var fileName = "sample-" + new Date().getTime() + ".png";
        
        //return promise with image url and key when image is successfully uploaded
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
    //clears current data on image
    doClear(){
        this.data = null;
    }
    //get picture from camera
    doGetCameraImage(width, height){
        return new Promise((resolve,reject) =>{ 
            //picture properties
            this.camera.getPicture({
                quality : 100,
                destinationType : this.camera.DestinationType.DATA_URL,
                sourceType : this.camera.PictureSourceType.CAMERA,
                allowEdit : true,
                encodingType: this.camera.EncodingType.PNG,
                targetWidth: width,
                targetHeight: height
            }).then((imageData) => {
                this.data = imageData;
                resolve(imageData);
            }, (_error) => {
                reject(_error);
            });
        });
    }
    //get picture from album
    doGetAlbumImage(width, height){
        return new Promise((resolve,reject) =>{
            //picture properties
            this.camera.getPicture({
                quality : 100,
                destinationType : this.camera.DestinationType.DATA_URL,
                sourceType : this.camera.PictureSourceType.SAVEDPHOTOALBUM,
                allowEdit : true,
                encodingType: this.camera.EncodingType.PNG,
                targetWidth: width,
                targetHeight: height
            }).then((imageData) => {
                this.data = imageData;
                resolve(imageData);
            }, (_error) => {
                reject(_error);
            });
        });
    }
}
