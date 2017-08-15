//vanilla ionic imports
import { Injectable } from '@angular/core';
import {Camera} from '@ionic-native/camera';
import { MediaCapture } from 'ionic-native';
import { File } from '@ionic-native/file';

//firebase imports
import * as firebase from 'firebase';

declare var window:any;

@Injectable()
export class ImagesProvider {

    data: any;
  constructor(public camera: Camera, public mediaCapture: MediaCapture, public file: File) {

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
                sourceType : this.camera.PictureSourceType.PHOTOLIBRARY,
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
    doGetVideo(){
        this.camera.getPicture({
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            mediaType: this.camera.MediaType.VIDEO,
            destinationType: this.camera.DestinationType.FILE_URI
        }).then((data) => {
            var uri = data+"";
            uri = uri.replace('/private','');
            alert(uri);
            window.resolveLocalFileSystemURL(uri, (fileEntry) => {
                alert("resolve");
                fileEntry.file(file => {
                    alert("fileEntry");
                    const fileReader = new FileReader();
                    fileReader.onloadend = (result: any) => {
                        alert("onloadend");
                        let arrayBuffer = result.target.result;
                        let blob = new Blob([new Uint8Array(arrayBuffer)], {type: 'video/quicktime'});
                        const name = '' + Date.now();
                        this.upload(blob, name);
                    };
                    
                    fileReader.readAsArrayBuffer(file);
                    
                    fileReader.onerror = (error) => {
                        alert("Error" + JSON.stringify(error));
                    }
                }, e => {
                    alert("You thought you didn't have any errors lol" + + JSON.stringify(e))
                });
            }, error => {
                alert("ERRRORR" + JSON.stringify(error));
            });
        });
    }
    upload(blob,name){
        alert("Upload");
        firebase.storage().ref('/videos/').child(name).put(blob).catch(e => {
            alert("error: " + e);
        });
    }
}
