import { Injectable } from '@angular/core';

@Injectable()
export class UserInfoProvider {

    user: any;
    pageState: string = 'map';
    lat: any = null;
    lng: any = null;
    zoom: any = null;
    allowPosition = false;
    constructor() {
    }
}
