import { Component, ViewChild } from '@angular/core';

import { AddComponent } from '../add/add'

@Component({
  selector: 'confirm',
  templateUrl: 'confirm.html'
})
export class ConfirmComponent {

  @ViewChild('preview') preview;
  @ViewChild('type') type;

  skip:boolean = true;
  constructor(public add: AddComponent) {
    
  }
  getSource(){
    if(this.add.preview != undefined){
      if(!this.skip)
        this.preview.nativeElement.setAttribute('src', this.add.preview.nativeElement.getAttribute('src'));
      this.skip = false;
    }
  }
  getType(){
    if(this.add.type == undefined)
      return;
    var src = "";
    switch(this.add.type){
      case 'bugs':
        src = "assets/images/buttons/bug.png";
        break;
      case 'cnd':
        src = "assets/images/buttons/cnd.png";
        break;
      case 'trash':
        src = "assets/images/buttons/trash.png";
        break;
      case 'building':
        src = "assets/images/buttons/building.png";
        break;
      case 'pest':
        src = "assets/images/buttons/pest.png";
        break;
      case 'water':
        src = "assets/images/buttons/droplet.png";
        break;
    }
    this.type.nativeElement.setAttribute('src', src);
  }
}
