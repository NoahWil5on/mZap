import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Events } from 'ionic-angular';

import { ImagesProvider } from '../../providers/images/images';
import { TranslatorProvider } from '../../providers/translator/translator';
import { UserInfoProvider } from '../../providers/user-info/user-info';

import { AddComponent } from '../add/add';

@Component({
    selector: 'picture',
    templateUrl: 'picture.html'
})
export class PictureComponent {
    @ViewChild('file') input: ElementRef
    @ViewChild('file1') input1: ElementRef

    imageData: any = "";
    dataSet: boolean = false;
    confirm: any;

    constructor(public images: ImagesProvider, public translate: TranslatorProvider, public add: AddComponent, public userInfo: UserInfoProvider, public ngZone: NgZone, public events: Events, private sanitizer: DomSanitizer) {

    }
    ngAfterViewInit() {
        var self = this;
        this.input.nativeElement.onchange = function (e) {
            var file = e.target.files[0];

            self.images.selectedFile = file;
            self.add.dataSet = true;
            var url = URL.createObjectURL(file);
            self.add.file = self.sanitizer.bypassSecurityTrustStyle(`url(${url})`);
            setTimeout(() => {
                self.add.state = 'confirm';
                console.dir(self.add.file);
            }, 50);
        }
        this.input1.nativeElement.onchange = function (e) {
            var file = e.target.files[0];

            self.images.selectedFile = file;
            self.add.dataSet = true;
            var url = URL.createObjectURL(file);
            self.add.file = self.sanitizer.bypassSecurityTrustStyle(`url(${url})`);
            setTimeout(() => {
                self.add.state = 'confirm';
            }, 50);
        }
    }
    cameraRequest(){
        var promise = this.images.doGetCameraImage(600,600);
        promise.then(res => {
            this.imageData = "data:image/jpg;base64,"+res;
            this.add.dataSet = true; 
            var image = new Image();
            image.src = this.imageData;
            this.add.dataURL = `url(${image.src})`;
            setTimeout(() => {
                this.add.state = 'confirm';
            },50);
            this.events.publish('confirmSource', this.imageData);
        }).catch(e => {
        });
    }
    /*Fetch image from album*/
    albumRequest(){
        var promise = this.images.doGetAlbumImage(600,600);
        promise.then(res => {
            this.imageData = "data:image/jpg;base64,"+res;
            this.add.dataSet = true; 
            var image = new Image();
            image.src = this.imageData;
            this.add.dataURL = `url(${image.src})`;
            setTimeout(() => {
                this.add.state = 'confirm';
            },50);
            this.events.publish('confirmSource', this.imageData);
        }).catch(e => {
        });
    }
}
