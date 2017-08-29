import { Component } from '@angular/core';
import { MapPage } from '../../pages/map/map';

//provider imports 
import { UserInfoProvider } from '../../providers/user-info/user-info';
import { TranslatorProvider } from '../../providers/translator/translator';

//firebase imports
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'info',
  templateUrl: 'info.html'
})
export class InfoComponent {

  state: any = 'info';
  edit: boolean = false;
  status: any = "";
  selection: any = "";

  constructor( public mapPage: MapPage, public translate: TranslatorProvider, public userInfo: UserInfoProvider, public afAuth: AngularFireAuth ) {
    var data = this.userInfo.activeData

    switch(data.type){
      case 'bugs':
        this.selection = 'assets/images/icons/bug.png';
        break;
      case 'trash':
        this.selection = 'assets/images/icons/trash.png';
        break;
      case 'building':
        this.selection = 'assets/images/icons/building.png';
        break;
      case 'pest':
        this.selection = 'assets/images/icons/pest.png';
        break;
      case 'cnd':
        this.selection = 'assets/images/icons/cnd.png';
        break;
      default:
        this.selection = 'assets/images/icons/bug.png';
        break;
    };

    //translate status
    switch(data.status){
      case 'Complete':
          this.status = this.translate.text.other.complete;
          break;
      case 'To Do':
          this.status = this.translate.text.other.todo;
          break;
    }
  }
  checkState(state){
    return state == this.state;
  }
  updateState(state){
    this.state = state;
    this.edit = false;
  }
  closeOut(){
    this.mapPage.infoShow = false;
  }
  loggedAuth(){
    return this.afAuth.auth.currentUser.uid == this.userInfo.activeData.id;
  }
}
