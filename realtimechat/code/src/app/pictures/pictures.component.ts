import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalPicPage } from '../modal-pic/modal-pic.page';

@Component({
  selector: 'app-pictures',
  templateUrl: './pictures.component.html',
  styleUrls: ['./pictures.component.scss'],
})
export class PicturesComponent implements OnInit {


  constructor(private modalController: ModalController) {}
  ngOnInit(){
  }
  async openModal(){
    this.modalController.create({component:ModalPicPage}).then((modalElement)=>{
      modalElement.present();
    });
  }


}
