import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InfoWindowPage } from './info-window';

@NgModule({
  declarations: [
    InfoWindowPage,
  ],
  imports: [
    IonicPageModule.forChild(InfoWindowPage),
  ],
  exports: [
    InfoWindowPage
  ]
})
export class InfoWindowPageModule {}
