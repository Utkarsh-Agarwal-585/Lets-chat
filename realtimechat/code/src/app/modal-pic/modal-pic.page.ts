import { Component, Input, OnInit } from '@angular/core';
import { PicturesComponent } from '../pictures/pictures.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-pic',
  templateUrl: './modal-pic.page.html',
  styleUrls: ['./modal-pic.page.scss'],
})
export class ModalPicPage implements OnInit {
  constructor(private modalController: ModalController){}
  ngOnInit() {
  }
  /*closeModal(){
    this.modalController.dismiss();
  }*/
   async closeModal() {
    if (this.modalController) {
      this.modalController.dismiss().then(() => { this.modalController = null; });
    }
  }
}
