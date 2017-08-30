import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapPage } from './map';
import { MapViewComponent } from '../../components/map-view/map-view';
import { InfoComponent } from '../../components/info/info';
import { InfoViewComponent } from '../../components/info-view/info-view';
import { CommentViewComponent } from '../../components/comment-view/comment-view';
import { EditViewComponent } from '../../components/edit-view/edit-view';
import { ResolveComponent } from '../../components/resolve/resolve';
import { AddComponent } from '../../components/add/add';
import { TypeComponent } from '../../components/type/type';
import { PictureComponent } from '../../components/picture/picture';

@NgModule({
  declarations: [
    MapPage,
    MapViewComponent,
    InfoComponent,
    InfoViewComponent,
    CommentViewComponent,
    EditViewComponent,
    ResolveComponent,
    AddComponent,
    TypeComponent,
    PictureComponent
  ],
  imports: [
    IonicPageModule.forChild(MapPage)
  ],
  exports: [
    MapPage,
    MapViewComponent,
  ]
})
export class MapPageModule {}
