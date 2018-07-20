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
import { FerryComponent } from './ferry/ferry';
import { EditShipComponent } from './edit-ship/edit-ship';
import { ShipTutorialComponent } from './ship-tutorial/ship-tutorial';
import { ReportComponent } from './report/report';
import { ShareComponent } from './share/share';
import { FerryMenuComponent } from './ferry-menu/ferry-menu';
import { FerryRatingComponent } from './ferry-rating/ferry-rating';

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
    AddResolveComponent,
    FerryComponent,
    EditShipComponent,
    ShipTutorialComponent,
    ReportComponent,
    ShareComponent,
    FerryMenuComponent,
    FerryRatingComponent],
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
    AddResolveComponent,
    FerryComponent,
    EditShipComponent,
    ShipTutorialComponent,
    ReportComponent,
    ShareComponent,
    FerryMenuComponent,
    FerryRatingComponent]
})
export class ComponentsModule {}
