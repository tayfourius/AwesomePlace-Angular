import { PlacePage } from "./../place/place";
import { ModalController } from "ionic-angular/components/modal/modal-controller";
import { PlacesService } from "./../../services/places";
import { Component, OnInit } from "@angular/core";
import { NavController } from "ionic-angular";
import { AddPlacePage } from "../add-place/add-place";
import { Place } from "../../models/place";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage implements OnInit {
  addPlacePage = AddPlacePage;

  constructor(
    public navCtrl: NavController,
    private placesService: PlacesService,
    private modalCtrl: ModalController
  ) {}
  places: Place[] = [];

  ionViewWillEnter() {
    this.places = this.placesService.loadPlaces();
  }

  onOpenPlace(place: Place, index: number) {
    const modal = this.modalCtrl.create(PlacePage, { place: place , index: index});
    modal.present();
  }

  ngOnInit() {
    this.placesService.fetchPlaces()
    .then(
      (places: Place[]) => {
        this.places = places;
      }
    );
  }
}
