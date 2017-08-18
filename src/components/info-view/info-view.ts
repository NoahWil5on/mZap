//vanilla ionic imports
import { Component, NgZone } from '@angular/core';

//provider imports
import { UserInfoProvider } from '../../providers/user-info/user-info';
import { LikeProvider } from '../../providers/like/like';
import { ClickProvider } from '../../providers/click/click';

@Component({
  selector: 'info-view',
  templateUrl: 'info-view.html'
})
export class InfoViewComponent {

  myData: any;
  likeValue: any;

  constructor(public userInfo: UserInfoProvider, public likeProvider: LikeProvider, public ngZone: NgZone, public click: ClickProvider) {
    this.myData = this.userInfo.activeData;
    this.likeable();
  }
  likeable(){
    var self = this;
    this.likeProvider.likeable(this.userInfo.activeData.key, function(value){
        //ngZone.run updates the DOM otherwise change is not visible
        self.ngZone.run(() =>{
            self.likeValue = value;   
        })
    });
  }
  //called when user likes a post
  like(value){
    this.click.click('mapLike');
    var self = this;
    this.likeProvider.like(this.userInfo.activeData.key, value, function(likes){
        //updates post locally with callback function
        self.userInfo.activeData.likes = likes;
    });
    this.likeValue = value;
  }
}
