import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-money',
  templateUrl: './money.page.html',
  styleUrls: ['./money.page.scss'],
})
export class MoneyPage implements OnInit {
  [x: string]: any;
  myForm: FormGroup;
  myForm1: FormGroup;
  myForm2: FormGroup;
  isActive = false;
  isnotActive = true;
  isShown = false;
  isnotShown = true;
  ishidden = false;
  isnothidden = true;
  public products: any;
  public categories: any;
  ipeCode = '';
  ipeCode1 = '';
  ipeCode2 = '';
  ipeCode3 = '';
  ipeCode4 = '';
  ipeCode5 = '';
  ipeCode6 = '';


  constructor(public formBuilder: FormBuilder, private alertController: AlertController,
    public api: ServiceService) { }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      code: new FormControl('3861638997', [Validators.required]),
      fname: new FormControl('sijo'),
      lname: new FormControl('v')
    });
    this.myForm1 = this.formBuilder.group({
      code: new FormControl('', [Validators.required])
    });
  }

  onclick() {
    console.log('onclick function');
    this.isActive = !this.isActive;
    this.isnotActive = !this.isnotActive;
    const data = { code: '3861638997' };
    this.api.getCategory(data).subscribe((res: any) => {
      this.res = res;
      console.log(res);
      this.ipeCode= res.data[0].code;
    });
  }
  details() {
    this.isShown = !this.isShown;
    this.isnotShown = !this.isnotShown;
    const data = { code: '3861638997' };
    this.api.getCategory(data).subscribe((res: any) => {
      this.res = res;
      console.log(res);
      this.ipeCode= res.data[0].code;
      this.ipeCode1= res.data[0].sender_firstname + res.data[0].sender_lastname;
      this.ipeCode2= res.data[0].receiver_firstname + res.data[0].receiver_firstname;
      this.ipeCode3= res.data[0].sender_amount;
      this.ipeCode4= res.data[0].receiver_amount;
      this.ipeCode5= res.data[0].sender_country;
      this.ipeCode6= res.data[0].receiver_country;
    });
  }
  async showPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'alert-prompt',
      header: 'Are you sure you want to validate this withdrawl ?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.onClick();
          }
        }
      ]
    });
    await alert.present();
  }
  onClick() {
    this.ishidden = !this.ishidden;
    this.isnothidden = !this.isnothidden;
  }
}
