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
  addAll(){
    this.loopArrays(this.add.checks, 1); 
    this.loopArrays(this.add.presets, 1); 
  }
  subAll(){
    this.loopArrays(this.add.checks, -1);   
    this.loopArrays(this.add.presets, -1);    
  }
  loopArrays(myArray, num){
    for(var i = 0; i < myArray.length; i++){
      var check = myArray[i];
      check.amount += num;
      if(check.amount > 999){
        check.amount = 999;
      }
      if(check.amount < 0){
        check.amount = 0;
      }
    }
  }
  convertToNumber(event):number {  
    var x = +event;
    x = Math.floor(x);
    if(x < 0){
      x = 0;
    }else if(x > 999){
      x = 999;
    }
    return x; 
  }
}
