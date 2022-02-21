import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalPicPageRoutingModule } from './modal-pic-routing.module';

import { ModalPicPage } from './modal-pic.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalPicPageRoutingModule
  ],
  declarations: [ModalPicPage]
})
export class ModalPicPageModule {}
