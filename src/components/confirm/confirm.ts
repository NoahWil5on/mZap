//vanilla ionic imports
import { Component, ViewChild } from '@angular/core';
import { Events } from 'ionic-angular';

//component imports
import { AddComponent } from '../add/add'

//provider imports
import { TranslatorProvider } from '../../providers/translator/translator';

@Component({
  selector: 'confirm',
  templateUrl: 'confirm.html'
})
export class ConfirmComponent {

  @ViewChild('preview') preview;
  @ViewChild('type') type;

  skip:boolean = true;
  constructor(public add: AddComponent, public events: Events, public translate: TranslatorProvider) {
    
  }
  ngAfterViewInit(){
    this.events.subscribe('confirmSource', (source) => {
      this.getSource(source);
    });
    this.events.subscribe('confirmType', (type) => {
      this.getType(type);
    })
  }
  getSource(image){
      this.preview.nativeElement.setAttribute('src', image);
  }
  getType(input){
    if(this.add.type == undefined)
      return;
    var src = "";
    switch(input){
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
      case 'road':
        src = "assets/images/buttons/road.png";
        break;
      case 'electricity':
        src = "assets/images/buttons/electricity.png";
        break;
      case 'tree':
        src = "assets/images/buttons/tree.png";
        break;
      case 'rocked':
        src = "assets/images/buttons/blocked_road.png";
        break;
    }
    this.type.nativeElement.setAttribute('src', src);
  }
}
