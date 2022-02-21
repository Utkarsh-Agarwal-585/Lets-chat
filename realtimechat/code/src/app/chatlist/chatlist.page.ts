import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, PopoverController } from '@ionic/angular';

import { PopovercompComponent } from '../popovercomp/popovercomp.component';

@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.page.html',
  styleUrls: ['./chatlist.page.scss'],
})
export class ChatlistPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  constructor( 
    private router: Router, 
    public popoverc: PopoverController
    ) { }
  
    async popclick(event) {
      const popover = await this.popoverc.create({
        component: PopovercompComponent,
        event
      });
      return await popover.present();
    }
    ngOnInit() {}

}
