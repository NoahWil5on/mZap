//vanill ionic imports
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

//provider imports
import { ImagesProvider } from '../../providers/images/images';
import { TranslatorProvider } from '../../providers/translator/translator';

//firebase imports
import * as firebase from 'firebase';

@IonicPage()
@Component({
    selector: 'page-edit-post',
    templateUrl: 'edit-post.html',
})
export class EditPostPage {

    data: any = {};
    dataSet: boolean = false;
    error: string = "";
    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
                public images: ImagesProvider, public translate: TranslatorProvider) {
    }

    ionViewDidLoad() {
        this.data = this.navParams.get('data');
    }
    dismiss(bool){
        this.viewCtrl.dismiss(bool);
    }
    cameraRequest(){
        var promise = this.images.doGetCameraImage(600,600);
        promise.then(res => {
           this.dataSet = true; 
        }).catch(e => {
        });
    }
    albumRequest(){
        var promise = this.images.doGetAlbumImage(600,600);
        promise.then(res => {
           this.dataSet = true; 
        }).catch(e => {
        });
    }
    submit(){
        if(this.data.description.length < 1){
            this.error = this.translate.text.editPost.error;
            return;
        }
        var self = this;
        if(!this.dataSet){
            firebase.database().ref('/positions/').child(self.data.key).update(self.data).then(_ => {
                self.dismiss(true);  
            });
        }else{
            if(this.data.refName){
                firebase.storage().ref('/images/').child(this.data.refName).delete().then(_ => {
                    var promiseObject = self.images.uploadToFirebase();
                    promiseObject.promise.then(res => {
                        self.data.url = res;
                        self.data.refName = promiseObject.refName;
                        firebase.database().ref('/positions/').child(self.data.key).update(self.data).then(_ => {
                            self.dismiss(true);  
                        });
                    }).catch(e => {
                        alert("Error: " +e.message);
                    });
                })
            }
            else{
                var promiseObject = self.images.uploadToFirebase();
                promiseObject.promise.then(res => {
                    self.data.url = res;
                    self.data.refName = promiseObject.refName;
                    firebase.database().ref('/positions/').child(self.data.key).update(self.data).then(_ => {
                        self.dismiss(true);  
                    });
                }).catch(e => {
                    alert("Error: " +e.message);
                });
            }
        }
    }
}
