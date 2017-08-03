//vanilla ionic imports
import { Injectable } from '@angular/core';

@Injectable()
export class UserInfoProvider {

    //singleton for current user data throughout app
    user: any;
    pageState: string = 'map';
    mapEdit: boolean = true;
    lat: any = null;
    lng: any = null;
    zoom: any = null;
    allowPosition = false;
    filter: any;
    filterReports: any;
    profileView: any;
    constructor() {
    }
}
