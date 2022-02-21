/* eslint-disable @typescript-eslint/no-shadow */
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  users={
    fname: '',
    lname: '',
    contactno:'',
    email:'',
    password:''
  };

  fName: any ='';
  lName: any ='';
  cNo: any='';
  eMail:any='';
  passWord:any='';
  fname: any;
  lname: any;
  contactno: any;
  email:any;
  password:any;
  ngForm: FormGroup;
   myToast: any;
  constructor(
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public AuthService: AuthService,
    private router: Router,
    private fire: AngularFireAuth,private db: AngularFireDatabase,
    public fb: FormBuilder,
    public toast: ToastController
  ) {
    this.fire.authState.subscribe(auth => {
      this.db.list(`users/${auth.uid}`).valueChanges().subscribe(profile => {
        console.log(profile[0]);
        this.cNo=profile[0];
        this.fName=profile[1];
        this.lName=profile[2];
        this.eMail=profile[3];

      });
    });
   }

  ngOnInit() {
    this.fName = this.AuthService.fName;
    this.lName=this.AuthService.lName;
    this.cNo=this.AuthService.cNo;
    this.eMail=this.AuthService.eMail;
    console.log(this.eMail);
    this.passWord=this.AuthService.passWord;
  }

  updateUser() {
    this.AuthService.updateUser(this.fName,this.lName,this.cNo,this.eMail).then(async () => {
      console.log('updated successfully');
      this.showToast();
    });
  }
  showToast() {
    this.myToast = this.toast.create({
      message: 'Updated Sucessfully',
      duration: 2000,
      position:'middle',
    }).then((toastData) => {
      console.log(toastData);
      toastData.present();
    });
  }


  logOut(){
    this.AuthService.signOut()
    .then(() => {
      console.log('logged out');
      this.router.navigate(['/login']);
    })
    .catch();

  }
}
