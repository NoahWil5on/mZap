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
import { DescriptionComponent } from '../../components/description/description';
import { ConfirmComponent } from '../../components/confirm/confirm';
import { LoginComponent } from '../../components/login/login';
import { CreateComponent } from '../../components/create/create';
import { ForgotComponent } from '../../components/forgot/forgot';
import { TutorialComponent } from '../../components/tutorial/tutorial';
import { AddResolveComponent } from '../../components/add-resolve/add-resolve';
import { FerryComponent } from '../../components/ferry/ferry';

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
    PictureComponent,
    DescriptionComponent,
    ConfirmComponent,
    LoginComponent,
    ForgotComponent,
    CreateComponent,
    TutorialComponent,
    AddResolveComponent,
    FerryComponent],
  imports: [
    IonicPageModule.forChild(MapPage)
  ],
  exports: [
    MapPage
  ]
})
export class MapPageModule {}
