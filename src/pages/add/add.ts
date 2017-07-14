import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { ImagesProvider } from '../../providers/images/images';


@IonicPage()
@Component({
  selector: 'page-add',
  templateUrl: 'add.html',
})
export class AddPage {
    data: any;
    dataSet: boolean = false;
    title: string = "";
    desc: string = "";
    url: any = "";
    refName: any = "";
    show: boolean = false;
    error: string = "";
    
    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
         public afAuth: AngularFireAuth, public images: ImagesProvider) {
    }

    ionViewDidLoad() {
        this.data = this.navParams.get('type');
    }
    cameraRequest(){
        var promise = this.images.doGetCameraImage();
        promise.then(res => {
           this.dataSet = true; 
        }).catch(e => {
        });
    }
    albumRequest(){
        var promise = this.images.doGetAlbumImage();
        promise.then(res => {
           this.dataSet = true; 
        }).catch(e => {
        });
    }
    dismiss(){
        this.viewCtrl.dismiss();
    }
    submit(){
        if(this.title.length > 0 && this.desc.length > 0 && this.dataSet){
            var promiseObject = this.images.uploadToFirebase();
            promiseObject.promise.then(res => {
                this.url = res;
                this.refName = promiseObject.refName;
                this.viewCtrl.dismiss({
                    title: this.title,
                    desc: this.desc,
                    type: this.data,
                    show: this.show,
                    email: this.afAuth.auth.currentUser.email,
                    url: this.url,
                    refName: this.refName
                });
            }).catch(e => {
                alert("Error: " +e.message);
            });
        }else{
            this.error = "Fill out all fields";
        }
    }

}
