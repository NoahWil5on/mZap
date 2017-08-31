import { Component} from '@angular/core';

import { AddComponent } from '../add/add'

@Component({
  selector: 'description',
  templateUrl: 'description.html'
})
export class DescriptionComponent {

  constructor(public add: AddComponent) {
  }
  ionViewDidLoad(){
  }

}
