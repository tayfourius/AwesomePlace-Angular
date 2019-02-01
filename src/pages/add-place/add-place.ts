import { Location } from "./../../models/location";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { NgForm } from "@angular/forms/src/directives/ng_form";
import { ModalController } from "ionic-angular/components/modal/modal-controller";
import { SetLocationPage } from "../set-location/set-location";
import { Geolocation } from "@ionic-native/geolocation";
import { LoadingController } from "ionic-angular/components/loading/loading-controller";
import { ToastController } from "ionic-angular/components/toast/toast-controller";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { PlacesService } from "../../services/places";
import { File } from "@ionic-native/file";

/**
 * Generated class for the AddPlacePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-add-place",
  templateUrl: "add-place.html"
})
export class AddPlacePage {
  constructor(
    private camera: Camera,
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private geolocation: Geolocation,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private placesService: PlacesService,
    private file: File
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad AddPlacePage");
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
    this.placesService.addPlace(
      form.value.title,
      form.value.description,
      this.location,
      this.imageUrl
    );
    form.reset();
    this.location = {
      lat: 40.7624324,
      lng: -73.9759827
    };
    this.imageUrl = "";
    this.locationIsSet = false;
  }

  location: Location = {
    lat: 40.7624324,
    lng: -73.9759827
  };

  locationIsSet;

  onOpenMap() {
    const modal = this.modalCtrl.create(SetLocationPage, {
      location: this.location
    });
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        this.location = data.location;
        console.log(this.location);
        this.locationIsSet = true;
      }
    });
  }
  onLocated() {
    const loader = this.loadingCtrl.create({
      content: "Getting Your Location..."
    });
    loader.present();
    this.geolocation
      .getCurrentPosition()
      .then(location => {
        loader.dismiss();
        this.location.lat = location.coords.latitude;
        this.location.lng = location.coords.longitude;
        this.locationIsSet = true;
        console.log(this.location);
      })
      .catch(error => {
        loader.dismiss();
        console.log(error);
        const toast = this.toastCtrl.create({
          message: "Count not get your location, Please pick it  manually!",
          duration: 2500
        });
        toast.present();
      });
  }

  onTakePhoto() {
    const options: CameraOptions = {
      quality: 100,
      //destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      //mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    };
    this.camera
      .getPicture(options)
      .then(imageData => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        // let base64Image = 'data:image/jpeg;base64,' + imageData;
        //console.log(imageData);
        const currentName = imageData.replace(/^.*[\\\/]/, "");
        const path = imageData.replace(/[^\/]*$/, "");
        const newFileName =new Date().getUTCMilliseconds() +'.jpg';
        this.file.moveFile(
          path,
          currentName,
          this.file.dataDirectory,
          newFileName
        ).then(
          data => {
            this.imageUrl = data.nativeURL;
            this.camera.cleanup();
            //this.file.removeFile(path,currentName);
          }
        )
        .catch(
          err => {
            this.imageUrl ='';
            const toast = this.toastCtrl.create({
              message: 'Could not save the Image. Please try Again...',
              duration: 2500
            });
            toast.present();
            this.camera.cleanup();
          }
        );
        this.imageUrl = imageData;
      })
      .catch(error => {
        console.log(error);
        const toast = this.toastCtrl.create({
          message: 'Could not take the Image. Please try Again...',
          duration: 2500
        });
        toast.present();

      });
  }

  imageUrl = "";
}
