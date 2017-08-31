import { NgModule } from '@angular/core';
import { MapViewComponent } from './map-view/map-view';
import { AddComponent } from './add/add';
import { TypeComponent } from './type/type';
import { PictureComponent } from './picture/picture';
import { DescriptionComponent } from './description/description';
import { ConfirmComponent } from './confirm/confirm';

@NgModule({
	declarations: [AddComponent,
    TypeComponent,
    PictureComponent,
    DescriptionComponent,
    ConfirmComponent,
    MapViewComponent],
	imports: [],
	exports: [AddComponent,
    TypeComponent,
    PictureComponent,
    DescriptionComponent,
    ConfirmComponent,
    MapViewComponent]
})
export class ComponentsModule {}
