import { Component } from '@angular/core';

import { AddComponent } from '../add/add';

@Component({
  selector: 'type',
  templateUrl: 'type.html'
})
export class TypeComponent {
  types: any = [];

  constructor(public add: AddComponent) {
    this.types.push({
      url: 'assets/images/buttons/cnd.png',
      type: 'cnd',
      selected: false,
    });
    this.types.push({
      url: 'assets/images/buttons/bug.png',
      type: 'bugs',
      selected: false,
    });
    this.types.push({
      url: 'assets/images/buttons/pest.png',
      type: 'pest',
      selected: false,
    });
    this.types.push({
      url: 'assets/images/buttons/building.png',
      type: 'building',
      selected: false,
    });
    this.types.push({
      url: 'assets/images/buttons/trash.png',
      type: 'trash',
      selected: false,
    });
    this.types.push({
      url: 'assets/images/buttons/droplet.png',
      type: 'water',
      selected: false,
    });
    if(this.add.type != undefined){
      this.checkSelection();
    }
  }
  checkSelection(){
    this.types.forEach(type => {
      if(this.add.type == type.type){
        type.selected = true;
      }
    });
  }
  selectTrue(selection){
    this.types.forEach(type => {
      if(selection == type.type){
        type.selected = true;
      }else{
        type.selected = false;
      }
    });
    this.add.type = selection;
    this.add.slideRight();
  }

}
