/* eslint-disable @typescript-eslint/no-shadow */
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, MinLengthValidator, Validators } from '@angular/forms';
import { AuthService, User } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ChatService } from '../services/chat.service';
import { CommonService } from '../common.service';
import { HttpClient } from '@angular/common/http';
import { getMaxListeners } from 'process';
import { AngularFireAuth } from '@angular/fire/auth';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
  userForm: FormGroup;
  successMsg = '';
  errorMsg = '';
  public user= [];
  //  User = null;
  // currentUser: User = null;
  //public baseUrl = "http://localhost:3000/api/";
  dataFromService: any = '';
  // eslint-disable-next-line @typescript-eslint/naming-convention
  error_msg = {
    email: [
      {
        type: 'required',
        message: 'Provide email.'
      },
      {
        type: 'pattern',
        message: 'Email is not valid.'
      }
    ],
    password: [
      {
        type: 'required',
        message: 'Password is required.'
      },
      {
        type: 'minlength',
        message: 'Password length should be 6 characters long.'
      }
    ]
  };
  // eslint-disable-next-line @typescript-eslint/type-annotation-spacing
  constructor(private router: Router,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private AuthService: AuthService,
    private toast: ToastController,
    private fb: FormBuilder,
    private afdb: AngularFireDatabase,
    public chat: ChatService,
    public commonService : CommonService,
    public http: HttpClient,
    private afAuth: AngularFireAuth,
    ) { 
      // this.afAuth.onAuthStateChanged((user: any) => {
      //   this.currentUser = user;
      //   if (user) {
      //     console.log(this.currentUser.uid);
      //   }
      // });
    }
    ngOnInit() {
      this.userForm = this.fb.group({
        fname:new FormControl('',[Validators.required,Validators.minLength(3)]),
        lname:new FormControl('',[Validators.required,Validators.minLength(3)]),
        email: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])),
        password: new FormControl('', Validators.compose([
          Validators.minLength(6),
          Validators.required
        ])),
        select:new FormControl(''),
      contact:new FormControl(''),
      });
     
    }
    signUp(value,params) {

      this.AuthService.createUser(value)
        .then((response) => {
          this.errorMsg = '';
          this.successMsg = 'New user created';
          this.afdb.object('users/'+response.user.uid).set({
          fname: value.fname,
          lname: value.lname,
          email:value.email,
          password:value.password,
          contact: value.contact,
         // userid: value.uid
          //sender: this.AuthService.updateUser(value.fname)
          }).then(()=>{
            this.router.navigateByUrl('login');
           //this.search();
          });
        }, error => {
          this.errorMsg = error.message;
          this.successMsg = '';
        });
    }
    // authenticate(param : object){
    //   return this.http.post(this.baseUrl+'signup' ,param)
    //   .subscribe((res: any)=>{
    //     console.log(res);
    //     this.userForm=res.data;
    //   });
    //   //return this.http.post(this.baseUrl+'login', param)
    // }

    // search() {
    //   console.log(this);
    //   var dataToSend = { fname: "hameedha" , lname :"sss", email:"h@email.com",contact:"9989898989"};
    //   console.log(dataToSend);
    //   this.AuthService.registerInBackend(dataToSend).subscribe((dataReturnFromService) => {
    //     console.log(dataReturnFromService);
    //     this.dataFromService = dataReturnFromService;
    //     console.log(this.dataFromService);
    //     //this.dataFromService= this.dataFromService.data[0].code;
    //   })
    // }

    // var headers = new Headers();
    // headers.append("Accept", 'application/json');
    // headers.append('Content-Type', 'application/json' );
    // const requestOptions = new RequestOptions({ headers: headers });

    // let postData = {
    //         "name": "Customer004",
    //         "email": "customer004@email.com",
    //         "tel": "0000252525"
    // }

    // this.http.post("http://127.0.0.1:3000/customers", postData, requestOptions)
    //   .subscribe(data => {
    //     console.log(data['_body']);
    //    }, error => {
    //     console.log(error);
    //   });
    goToLogin() {
      this.router.navigateByUrl('login');
    }
    
}

  /*ngOnInit() {
    this.userForm=this.fb.group({
      fname:new FormControl('',[Validators.required,Validators.minLength(3)]),
      lname:new FormControl('',[Validators.required,Validators.minLength(3)]),
      email:new FormControl('',[Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]),
      password:new FormControl('',[Validators.required]),
      select:new FormControl('',[Validators.required]),
      contact:new FormControl('',[Validators.required, Validators.pattern('[0-9 ]{10}')]),
    });
  }
 /* submit(){
    console.log('firstname:', this.myForm.value.fname);
    console.log('lastname:', this.myForm.value.lname);
    console.log('email:', this.myForm.value.lname);
    console.log('password:', this.myForm.value.lname);
    console.log('select:', this.myForm.value.select);
    console.log('contact:', this.myForm.value.lname);
  }*/
  /*this.userForm = this.fb.group({
    email: new FormControl('', Validators.compose([
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    ])),
    password: new FormControl('', Validators.compose([
      Validators.minLength(6),
      Validators.required
    ])),
  });
}

signUp(value) {
  this.ionicAuthService.createUser(value)
    .then((response) => {
      this.errorMsg = "";
      this.successMsg = "New user created.";
    }, error => {
      this.errorMsg = error.message;
      this.successMsg = "";
    })
}

goToLogin() {
  this.router.navigateByUrl('login');
}*/



