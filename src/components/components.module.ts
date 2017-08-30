import { NgModule } from '@angular/core';
import { AddComponent } from './add/add';
import { TypeComponent } from './type/type';
import { PictureComponent } from './picture/picture';
@NgModule({
	declarations: [AddComponent,
    TypeComponent,
    PictureComponent],
	imports: [],
	exports: [AddComponent,
    TypeComponent,
    PictureComponent]
})
export class ComponentsModule {}
