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
    { value:'a',
      color: '#24b9ed',
      border: '#126bd6'},
    { value:'b',
      color: '#f2ea37',
      border: '#ffce07'},
    { value:'c',
      color: '#3d4da1',
      border: '#21215f'},
    { value:'d',
      color: '#57b947',
      border: '#1d5a2d'},
    { value:'e',
      color: '#e82125',
      border: '#811517'},
    { value:'f',
      color: '#9c248e',
      border: '#571853'},
    ]
  }
  checkColor(color){
    return this.add.currentColor == color;
  }
}
