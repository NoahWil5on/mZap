//vanilla ionic imports
import { Component } from '@angular/core';
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

  constructor(public add: AddComponent, public events: Events, public translate: TranslatorProvider) {
  }
}
