import { Component} from '@angular/core';

import { AddComponent } from '../add/add'
import { TranslatorProvider } from '../../providers/translator/translator';

@Component({
  selector: 'description',
  templateUrl: 'description.html'
})
export class DescriptionComponent {

  constructor(public add: AddComponent, public translate: TranslatorProvider) {
  }
  ionViewDidLoad(){
  }

}
