import { PlacesService } from './../../services/places';
import { ViewController } from "ionic-angular/navigation/view-controller";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Place } from "../../models/place";


/**
 * Generated class for the PlacePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-place",
  templateUrl: "place.html"
})
export class PlacePage {
  place: Place;
  index : number;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private placesService: PlacesService
  ) {
    this.place = this.navParams.get("place");
    this.index = this.navParams.get('index');
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad PlacePage");
  }

  onLeave() {
    this.viewCtrl.dismiss();
  }

  onDelete() {
    this.placesService.deletePlace(this.index);
    this.onLeave();
  }
}
