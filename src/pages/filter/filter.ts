//Vanilla ionic import
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

//providers import
import { TranslatorProvider } from '../../providers/translator/translator';
import { UserInfoProvider } from '../../providers/user-info/user-info';
import { ClickProvider } from '../../providers/click/click';

@IonicPage()
@Component({
    selector: 'page-filter',
    templateUrl: 'filter.html',
})
export class FilterPage {
    range: any = {};
    status: any = ["To Do", "Complete"];
    type: any = [];
    error: string = "";
    target: string = "";

    bugs = true;
    building = true;
    water = true;
    cnd = true;
    trash = true;
    pest = true;
    constructor(public navCtrl: NavController, public navParams: NavParams, public translate: TranslatorProvider,
                public viewCtrl: ViewController, public userInfo: UserInfoProvider,
                public click: ClickProvider) {
        this.target = navParams.get('target');
    }

    ionViewDidLoad() {
        this.range.lower = -5;
        this.range.upper = 50;
    }
    statusClick(){
        this.click.click('filterStatus');
    }
    ratingClick(){
        this.click.click('filterRating');
    }
    typeClick(){
        this.click.click('filterType');
    }
    //dismiss this modal
    dismiss(){
        this.viewCtrl.dismiss();
    }
    //when filter is clicked, all data from page is thrown into user-info provider
    //to be accessed by map.ts
    filter(){
        this.type = [];

        if(this.water) this.type.push("water");
        if(this.building) this.type.push("building");
        if(this.cnd) this.type.push("cnd");
        if(this.pest) this.type.push("pest");
        if(this.bugs) this.type.push("bugs");
        if(this.trash) this.type.push("trash");
        
        if(this.status.length < 1 || this.type.length < 1){
            this.error = this.translate.text.filter.error;
            return;
        }

        var obj = {
            upper: this.range.upper,
            lower: this.range.lower,
            status: this.status,
            type: this.type
        }
        switch(this.target){
            case 'reports':
                this.userInfo.filterReports = obj;
                break;
            case 'map': 
                this.userInfo.filter = obj;
                break;
            default: 
                break;
        }
        this.viewCtrl.dismiss(true);
    }
}
