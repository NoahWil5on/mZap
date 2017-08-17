import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapPage } from './map';
import { MapViewComponent } from '../../components/map-view/map-view';

@NgModule({
  declarations: [
    MapPage,
    MapViewComponent
  ],
  imports: [
    IonicPageModule.forChild(MapPage)
  ],
  exports: [
    MapPage,
    MapViewComponent
  ]
})
export class MapPageModule {}
