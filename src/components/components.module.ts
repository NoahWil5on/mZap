import { NgModule } from '@angular/core';
import { MapViewComponent } from './map-view/map-view';
import { AddComponent } from './add/add';
import { TypeComponent } from './type/type';
import { PictureComponent } from './picture/picture';
import { DescriptionComponent } from './description/description';
import { ConfirmComponent } from './confirm/confirm';
import { LoginComponent } from './login/login';
import { ForgotComponent } from './forgot/forgot';
import { CreateComponent } from './create/create';
import { TutorialComponent } from './tutorial/tutorial';
import { AddResolveComponent } from './add-resolve/add-resolve';

@NgModule({
	declarations: [AddComponent,
    TypeComponent,
    PictureComponent,
    DescriptionComponent,
    ConfirmComponent,
    MapViewComponent,
    LoginComponent,
    ForgotComponent,
    CreateComponent,
    TutorialComponent,
    AddResolveComponent],
	imports: [],
	exports: [AddComponent,
    TypeComponent,
    PictureComponent,
    DescriptionComponent,
    ConfirmComponent,
    MapViewComponent,
    LoginComponent,
    ForgotComponent,
    CreateComponent,
    TutorialComponent,
    AddResolveComponent]
})
export class ComponentsModule {}
