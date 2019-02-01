import { Location } from './../models/location';

import { Place } from "../models/place";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { File } from "@ionic-native/file";

@Injectable()
export class PlacesService {
  private places: Place[] = [];

  constructor(private storage: Storage, private file: File) {}

  addPlace(
    title: string,
    descirption: string,
    location: Location,
    imageUrl: string
  ) {
    const place = new Place(title, descirption, location, imageUrl);
    this.places.push(place);
    console.log(this.places);
    this.storage
      .set("places", this.places)
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        this.places.splice(this.places.indexOf(place), 1);
      });
  }

  loadPlaces() {
    return this.places.slice();
  }

  fetchPlaces() {
   return this.storage
      .get("places")
      .then((places: Place[]) => {
        this.places = places != null ? places : [];
        return this.places.slice();
      })
      .catch(err => {
        console.log(err);
      });
  }

  deletePlace(index: number) {
    const place = this.places[index];
    this.places.splice(index, 1);
    this.storage
      .set("places", this.places)
      .then(() => {
        this.removeFile(place);
      })
      .catch(err => {
        console.log(err);
      });
  }

  private removeFile(place: Place) {
    const currentName = place.imageUrl.replace(/^.*[\\\/]/, "");
    this.file
      .removeFile(this.file.dataDirectory, currentName)
      .then(() => {
        console.log("Removed File");
      })
      .catch(() => {
        console.log("Error while removing File");
        this.addPlace(
          place.title,
          place.description,
          place.location,
          place.imageUrl
        );
      });
  }
}
