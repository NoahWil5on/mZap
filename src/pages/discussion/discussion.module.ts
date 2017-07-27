import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DiscussionPage } from './discussion';

@NgModule({
  declarations: [
    DiscussionPage,
  ],
  imports: [
    IonicPageModule.forChild(DiscussionPage),
  ],
  exports: [
    DiscussionPage
  ]
})
export class DiscussionPageModule {}
