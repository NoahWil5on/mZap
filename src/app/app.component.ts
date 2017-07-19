import { Component } from '@angular/core';
import { Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { TopRatedPage } from '../pages/top-rated/top-rated';
import { MapPage } from '../pages/map/map';
import { ProfilePage } from '../pages/profile/profile';
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
    firstOpen: boolean = true;
    name: any = '';
    imgSrc: any = '';
    rootPage:any = LoginPage;
    
    mapPage: any;
    ratedPage: any;
    profilePage: any;
    
    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private afAuth: AngularFireAuth, private menuCtrl: MenuController) {
        this.mapPage = MapPage;
        this.ratedPage = TopRatedPage;
        this.profilePage = ProfilePage;
        platform.ready().then(() => {
            /*if(Network.connection == Connection.NONE){
                var alert = this.alertCtrl.create({
                    title: "No Internet Connection",
                    subTitle: "Please try application again when you have connection",
                    buttons: [{
                        text: "OK",
                        handler: () => {
                        platform.exitApp();
                    }
                    }]
                });
                alert.present();
            }*/
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();

            /*var bgGeo = (<any>window).BackgroundGeolocation;
            console.log(bgGeo);
            var onLocation = function(location, taskId) {
                var coords = location.coords;
                var lat    = coords.latitude;
                var lng    = coords.longitude;
                console.log('- Location: ', JSON.stringify(location));

                // Must signal completion of your callbackFn.
                bgGeo.finish(taskId);
            };
            var onLocationFailure = function(fail){
                console.log("Fail" + fail);
            }
            var onMotionChange = function(res){
                console.log("Motion Change: " + res);
            }
            var onProviderChange = function(res){
                console.log("Provider Change: " + res);
            }
            
            // 1.  Listen to events
            bgGeo.on('location', onLocation, onLocationFailure);
            bgGeo.on('motionchange', onMotionChange);
            bgGeo.on('providerchange', onProviderChange);

            // 2. Configure the plugin.  
            bgGeo.configure({
                desiredAccuracy: 0,   // <-- Config params
                distanceFilter: 50,
                stationaryRadius: 25,
                // Activity Recognition config
                activityRecognitionInterval: 10000,
                stopTimeout: 5,
                // Application config
                debug: true,  // <-- Debug sounds & notifications.
                stopOnTerminate: false,
                startOnBoot: true,
            }, function(state) {    // <-- Current state provided to #configure callback
                // 3.  Start tracking
                console.log('BackgroundGeolocation is configured and ready to use');
                if (!state.enabled) {
                    bgGeo.start(function() {
                        console.log('- BackgroundGeolocation tracking started');
                    });
                }
            });*/
        });
    }
    topRated(){
        this.rootPage = TopRatedPage;
        this.menuCtrl.close();
    }
    map(){
        this.rootPage = MapPage; 
        this.menuCtrl.close();
    }
    profile(){
        this.rootPage = ProfilePage;
        this.menuCtrl.close();
    }
    openMenu(){
        if(this.firstOpen){
            this.rootPage = MapPage;
            this.firstOpen = false;
        }
        if(this.checkLogin()){
            firebase.database().ref('users').child(this.afAuth.auth.currentUser.uid).once('value').then((snapshot) => {
                this.name = snapshot.val().name;
                this.imgSrc = snapshot.val().url;
            });
        }
    }
    checkLogin(){
        return (this.afAuth.auth.currentUser) ? true : false;
    }
    checkPage(root){
        return (this.rootPage == root);
    }
}

