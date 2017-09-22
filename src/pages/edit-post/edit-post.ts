//vanilla ionic imports
import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Slides } from 'ionic-angular';

//provider imports
import { ImagesProvider } from '../../providers/images/images';
import { TranslatorProvider } from '../../providers/translator/translator';
import { ClickProvider } from '../../providers/click/click';
import { UserInfoProvider } from '../../providers/user-info/user-info';

//firebase imports
import * as firebase from 'firebase';

@IonicPage()
@Component({
    selector: 'page-edit-post',
    templateUrl: 'edit-post.html',
})
export class EditPostPage {
    @ViewChild(Slides) slide: Slides;
    @ViewChild('preview') preview;
    imageData: string = "";
    
    data: any = {};
    resolves: any = [];
    deleted: any = [];
    dataSet: boolean = false;
    error: string = "";
    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
                public images: ImagesProvider, public translate: TranslatorProvider, public ngZone: NgZone,
                public click: ClickProvider, public userInfo: UserInfoProvider) {
        this.images.doClear();

        var self = this;
        this.data = this.userInfo.activeData
        var ref = firebase.database().ref('/resolves/');
        ref.once('value', snapshot => {
            if(!snapshot.hasChild(this.data.key)) return;
            ref.child(this.data.key).once('value').then(snap => {
                snap.forEach(function(item){
                    var obj =  {
                        url: item.val().url,
                        refName: item.val().refName,
                        info: "",
                        delete: false,
                        key: item.key
                    }
                    if(item.val().info){
                        obj.info = item.val().info;
                    }
                    self.resolves.push(obj);
                }); 
            });
        });
    }
    dismiss(bool){
        this.viewCtrl.dismiss(bool);
    }
    cameraRequest(){
        this.click.click('editPostCamera');
        var promise = this.images.doGetCameraImage(600,600);
        promise.then(res => {
            this.imageData = "data:image/jpg;base64,"+res;
            this.preview.nativeElement.setAttribute('src', this.imageData);
            this.dataSet = true; 
        }).catch(e => {
        });
    }
    albumRequest(){
        this.click.click('editPostAlbum');
        var promise = this.images.doGetAlbumImage(600,600);
        promise.then(res => {
            this.imageData = "data:image/jpg;base64,"+res;
            this.preview.nativeElement.setAttribute('src', this.imageData);
            this.dataSet = true;  
        }).catch(e => {
        });
    }
    statusClick(){
        this.click.click('editPostStatus');
    }
    typeClick(){
        this.click.click('editPostType');
    }
    descriptionClick(){
        this.click.click('editPostDescription');
    }
    submit(){
        this.click.click('editPostSubmit');
        if(this.data.description.length < 1){
            this.error = this.translate.text.editPost.error;
            return;
        }
        var self = this;
        if(!this.dataSet){
            firebase.database().ref('/positions/').child(self.data.key).update(self.data).then(_ => {
                self.actuallyDeleteResolves()  
            });
        }else{
            if(this.data.refName){
                firebase.storage().ref('/images/').child(this.data.refName).delete().then(_ => {
                    var promiseObject = self.images.uploadToFirebase("posts");
                    promiseObject.promise.then(res => {
                        self.data.url = res;
                        self.data.refName = promiseObject.refName;
                        firebase.database().ref('/positions/').child(self.data.key).update(self.data).then(_ => {
                            self.actuallyDeleteResolves();
                        });
                    }).catch(e => {
                        alert("Error: " +e.message);
                    });
                })
            }
            else{
                var promiseObject = self.images.uploadToFirebase("posts");
                promiseObject.promise.then(res => {
                    self.data.url = res;
                    self.data.refName = promiseObject.refName;
                    firebase.database().ref('/positions/').child(self.data.key).update(self.data).then(_ => {
                        self.actuallyDeleteResolves();  
                    });
                }).catch(e => {
                    alert("Error: " +e.message);
                });
            }
        }
    }
    actuallyDeleteResolves(){
        var self = this;
        if(this.deleted.length < 1){
            this.dismiss(true);
            return;
        }
        this.deleted.forEach(function(item){
            firebase.database().ref('/positions/').child(self.data.key).child('resolves').child(item.key).remove()
                .then(_ => {
                firebase.database().ref('/resolves/').child(self.data.key).child(item.key).remove().then(_ => {
                    firebase.storage().ref('/images/').child(item.refName).delete();
                })
            })
        });
        this.dismiss(true);
    }
    deleteResolve(item){
        this.click.click('editPostDelete');
        this.ngZone.run(() => {
            this.resolves[this.resolves.indexOf(item)].delete = true;
        });
        this.deleted.push(item);
    }
}
