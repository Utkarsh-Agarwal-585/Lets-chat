import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalPicPage } from './modal-pic.page';

const routes: Routes = [
  {
    path: '',
    component: ModalPicPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalPicPageRoutingModule {}
