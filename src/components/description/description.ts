import { Component} from '@angular/core';

import { AddComponent } from '../add/add'
import { TranslatorProvider } from '../../providers/translator/translator';

@Component({
  selector: 'description',
  templateUrl: 'description.html'
})
export class DescriptionComponent {

  colors: any = [];
  constructor(public add: AddComponent, public translate: TranslatorProvider) {
    this.colors = [
      '#ff0000',
      '#ffff00',
      '#00ff00',
      '#00ffff',
      '#0000ff',
      '#ff00ff'
    ]
  }
  checkColor(color){
    return this.add.currentColor == color;
  }
}
