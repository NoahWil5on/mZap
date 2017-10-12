//vanilla ionic imports
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

//page imports
import { MapPage } from '../map/map';

//firebase imports
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

//provider imports
import { ImagesProvider } from '../../providers/images/images';
import { UserInfoProvider } from '../../providers/user-info/user-info';
import { TranslatorProvider } from '../../providers/translator/translator';
import { ClickProvider } from '../../providers/click/click';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
    @ViewChild('preview') preview;
    imageData: string = "";
    
    //user input data
    email: string = "";
    pass1: string = "";
    pass2: string = "";
    name: string = "";
    image: boolean = false;
    startTrue: boolean = true;
    refName: any = "";
    url: any = "";

    error: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public afAuth: AngularFireAuth,
              public afDB: AngularFireDatabase, public images: ImagesProvider, public userInfo: UserInfoProvider,
              private storage: Storage, public translate: TranslatorProvider, public menuCtrl: MenuController,
              public click: ClickProvider) {
      this.images.doClear();
  }

  ionViewDidLoad() {
  }
    ionViewWillLeave(){
        this.menuCtrl.enable(true);
    }
    inputClick(input){
        this.click.click('register'+input);
    }
    /*Tries to create account*/
    async createAccount(){
        this.click.click('registerCreateAccount');
        this.startTrue = false;
        
        /*Checks to make sure fields are filled in (no profile image required)*/
        if(this.pass1 === this.pass2){
            if(this.pass1.length > 0 && this.email.length > 0 && this.name.length > 0){
                
                /*Create user*/
                this.afAuth.auth.createUserWithEmailAndPassword(this.email,this.pass1).then(_ => {
                    
                    /*add user display name*/
                    this.afAuth.auth.currentUser.updateProfile({
                        displayName: this.name,
                        photoURL: ""
                    }).then(_ =>{
                        this.storage.set('mission_x_email', this.email);
                        this.storage.set('mission_x_password', this.pass1);
                        var today = new Date();
                        //let date = (today.getMonth()+1) + "-" + today.getDate() + "-" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                        
                        /*Checks if user submitted an image*/
                        if(this.image){
                            
                            /*Fetches image*/
                            var promiseObject = this.images.uploadToFirebase("posts");
                            promiseObject.promise.then(res => {
                                this.url = res;
                                this.refName = promiseObject.refName;
                                
                                /*pushes user details to database*/
                                this.afDB.object('users/'+this.afAuth.auth.currentUser.uid).update({
                                    rating: 0, 
                                    visits: 1, 
                                    lastActive: today, 
                                    firstActive: today, 
                                    name: this.name, 
                                    refName: this.refName, 
                                    email: this.email,
                                    url: this.url}
                                ).then(_ => {
                                    this.userInfo.pageState = 'map';
                                    this.navCtrl.setRoot(MapPage);
                                }).catch(e => {
                                    alert(e.message);
                                });
                            }).catch(e => {
                                alert(e.message);
                            });
                        }
                        else{
                            
                            /*If no image just add some basic info*/
                            this.afDB.object('users/'+this.afAuth.auth.currentUser.uid).update({
                                rating: 0, 
                                posts: 0, 
                                visits: 1, 
                                lastActive: today, 
                                firstActive: today, 
                                name: this.name,
                                email: this.email
                            }
                            ).then(_ => {
                                this.userInfo.pageState = 'map';
                                this.navCtrl.setRoot(MapPage);
                            }).catch(e => {
                                console.log(e.message);
                            })
                        }
                    }).then(_ => {
                        firebase.database().ref('/userRating/').child(this.afAuth.auth.currentUser.uid).set({
                            likes: 0,
                            posts: 0,
                            postLikes: 0,
                            resolves: 0,
                            complete: 0
                        });
                    }).catch(e => {
                        this.error = e.message;
                    });
                }).catch(e => {
                    this.error = e.message;
                });
            }
            else{
                this.error = this.translate.text.register.fill;
            }
        }else{
            this.error = this.translate.text.register.identical;
        }
    }
    /*Finds content that isn't filled in correctly*/
    checkContent(data){
        if(this.startTrue) return false;
        if(data.length > 0){
            switch(this.error){
                case "The email address is badly formatted.":
                    if(data == this.email) return true
                    else return false
                case "Password should be at least 6 characters":
                    if(data == this.pass1 || data == this.pass2) return true
                    else return false
                case "Passwords must be identical":
                    if(data == this.pass1 || data == this.pass2) return true
                    else return false
                default:
                    return false;
            }
        }return true;
    }
    /*Fetch image from camera*/
    cameraRequest(){
        this.click.click('registerCamera');
        var promise = this.images.doGetCameraImage(100,100);
        promise.then(res => {
            this.imageData = "data:image/jpg;base64,"+res;
            this.preview.nativeElement.setAttribute('src', this.imageData);
            this.image = true;
        }).catch(e => {
        });
    }
    /*Fetch image from album*/
    albumRequest(){
        this.click.click('registerAlbum');
        var promise = this.images.doGetAlbumImage(100,100);
        promise.then(res => {
            this.imageData = "data:image/jpg;base64,"+res;
            this.preview.nativeElement.setAttribute('src', this.imageData);
            this.image = true;
        }).catch(e => {
        });
    }
}
