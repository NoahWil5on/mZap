import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConsentPage } from './consent';

@NgModule({
  declarations: [
    ConsentPage,
  ],
  imports: [
    IonicPageModule.forChild(ConsentPage),
  ],
})
export class ConsentPageModule {}
