//vanilla ionic imports
import { Injectable } from '@angular/core';
import {Camera} from '@ionic-native/camera';
import { MediaCapture } from 'ionic-native';
import { File } from '@ionic-native/file';

//firebase imports
import * as firebase from 'firebase';
import { UserInfoProvider } from '../user-info/user-info';

declare var window;

@Injectable()
export class ImagesProvider {
    data: any;
    selectedFile: any;

    constructor(public camera: Camera, public mediaCapture: MediaCapture, public file: File, public userInfo: UserInfoProvider) {

    }
    //takes image and uploads it to firebase
    uploadToFirebase(location){
        //gives the file an original name based on date and time
        var fileName = location + "-" + new Date().getTime() + ".png";
        
        if(!this.userInfo.isApp){
            //return promise with image url and key when image is successfully uploaded
            return {
                promise: new Promise((resolve,reject) => {
                    firebase.storage().ref('/images/').child(location).child(fileName).put(this.selectedFile).then((data) => {
                        resolve(data.downloadURL);
                    }).catch((e) => {
                        reject(e);
                    })            
                }),
                refName: fileName
            };
        }
        else{
            //return promise with image url and key when image is successfully uploaded
            return {
                promise: new Promise((resolve,reject) => {
                    firebase.storage().ref('/images/').child(location).child(fileName).putString(this.data, 'base64', {contentType: 'image/png'}).then((data) => {
                        resolve(data.downloadURL);
                    }).catch((e) => {
                        reject(e);
                    })            
                }),
                refName: fileName
            };
        }
    }
    //clears current data on image
    doClear(){
        this.data = null;
        this.selectedFile = null;
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
       // var self = this;
        var onSuccess = function(videoData){
            
            alert(JSON.stringify(videoData));
            
            var name = "filename.mp4";
            
            var path = videoData[0].fullPath + "";
            path = "file://" + path.replace("/private", "");             
            //alert(path);
            //alert(self.file.dataDirectory);
            
            ////
            window.resolveLocalFileSystemURL(path, (fileEntry) => {
                alert("something Else");
                fileEntry.file( (file) => {
                    alert("fileEntry.file");
                    let fileReader = new FileReader();

                    fileReader.onloadend = (result: any) => {
                        alert("inside onloadend")
                        let arrayBuffer = result.target.result;
                        let blob = new Blob([new Uint8Array(arrayBuffer)], {type: 'video/mp4'});
                        firebase.storage().ref('/videos/').child(name).put(blob).catch(e => {
                            alert("Error uploading")
                        });
                    };

                    fileReader.onerror = (error: any) => {
                        alert("There has been an error")
                    };
                    fileReader.readAsArrayBuffer(file);
                });
            }, error => {
                alert("hey we're running an error");
            });


            ////
//            self.file.readAsArrayBuffer(this.file.dataDirectory, videoData[0].name).then(data => {
//                alert("something");
//                // success
//                console.log(data);
//
//                var blob = new Blob([data], {type: "video/mp4"});
//
//                console.log(blob);
//
//                var uploadTask = firebase.storage().ref('/videos/').child(name).put(blob);
//
//                uploadTask.on('state_changed', function(snapshot){
//                    // Observe state change events such as progress, pause, and resume
//                    // See below for more detail
//
//                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//                    console.log('Upload is ' + progress + '% done'); 
//
//                }, function(error) {
//                    // Handle unsuccessful uploads
//                    alert("Error uploading: " + error)
//                }, function() {
//                    // Handle successful uploads on complete
//                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
//                    var downloadURL = uploadTask.snapshot.downloadURL;
//                    alert("Success! " + downloadURL);
//                });
//
//            }).catch( error => {
//                // error
//                alert("Failed to read video file from directory, error.code");
//            });
        }
        MediaCapture.captureVideo().then(onSuccess);
    }
}
