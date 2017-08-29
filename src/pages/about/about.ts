import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  reportType: any = [];
  reports: boolean = false;
  mzap: boolean = false;
  gd: string = "Use this function to do blah blah blah on a something report is effective for rats trees bugs and birds and symbolic of national pride";
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.reportType.push({
      img: "http://www.placehold.it/40",
      title: "Abandoned Building",
      desc: this.gd,
    });
    this.reportType.push({
      img: "http://www.placehold.it/40",
      title: "Mosquitos",
      desc: this.gd,
    });
    this.reportType.push({
      img: "http://www.placehold.it/40",
      title: "Cats and Dogs",
      desc: this.gd,
    });
    this.reportType.push({
      img: "http://www.placehold.it/40",
      title: "Pests",
      desc: this.gd,
    });
    this.reportType.push({
      img: "http://www.placehold.it/40",
      title: "Trash",
      desc: this.gd,
    });
  }
  toggleReports(){
    this.reports = !this.reports;
  }
  toggleMzap(){
    this.mzap = !this.mzap;
  }
}
