import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TopRatedPage } from './top-rated';

@NgModule({
  declarations: [
    TopRatedPage,
  ],
  imports: [
    IonicPageModule.forChild(TopRatedPage),
  ],
  exports: [
    TopRatedPage
  ]
})
export class TopRatedPageModule {}
