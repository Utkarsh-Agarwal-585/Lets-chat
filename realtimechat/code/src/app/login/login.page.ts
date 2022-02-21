/* eslint-disable @typescript-eslint/no-shadow */
import { Component, NgZone, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
//import { CommonService } from '../common.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase, { auth } from 'firebase';
import { AuthGuard } from '../guards/auth.guard';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  errorMessage= '';
  userForm: FormGroup;
  successMsg = '';
  errorMsg = '';
  users='';
  pass='';


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
  provider={
    email:'',
    password:'',
    loggedin: false
  };
  githubloggedin: false;

  constructor(public fb: FormBuilder,
    public router: Router,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public AuthService: AuthService,
    private toast: ToastController,
    private loadingController: LoadingController,
    public angularFireAuth: AngularFireAuth,
    public ngZone: NgZone,
    private authGuard: AuthGuard) { }

  ngOnInit() {
    this.userForm = this.fb.group({
      email: new FormControl('sijo.vijayan@infosyncit.com', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('123456', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
    });
  }

  signIn(value) {
    this.AuthService.signinUser(value)
      .then((response) => {
        console.log(response);
        this.errorMsg = '';
        console.log('authStatus',this.AuthService.firebaseAuthCheck());
        this.router.navigateByUrl('dashboard');
      }, error => {
        this.errorMsg = error.message;
        console.log('authStatus',this.AuthService.firebaseAuthCheck());
        this.successMsg = '';
      });
  }
  loginWithGithub(){
    this.angularFireAuth.signInWithPopup(new firebase.auth.GithubAuthProvider())
    .then(res=>{
      console.log('from github');
      console.log(res);
      this.router.navigateByUrl('dashboard');
      console.log('authStatus',this.AuthService.firebaseAuthCheck());
     this.provider.loggedin= true;
      this.users=res.user.email;
      this.provider.email=this.users;
    });
  }
 /* loginWithGoogle(){
    return this.AuthLogin(new auth.GoogleAuthProvider())
  }
  AuthLogin(proider){
    this.angularFireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then((res)=>{
      console.log('from google');
      console.log(res)
      this.ngZone.run(()=>{
        this.router.navigate(['dashboard'])
      })
    })
  }*/

  goToSignup() {
    this.router.navigateByUrl('registration');
  }
  }
 /* async login(){
    console.log(this.myForm.value);
    const loading= await this.loadingController.create({
      message: 'Please Wait',
     // duration: 5000
    });
      await loading.present();
    this.commonService.authenticate(this.myForm.value)
    .subscribe(async (res: any)=>{
      await loading.dismiss();
      console.log(res);
      if(res.status === true){
        this.errorMessage='';
        this.commonService.authStatus=true;
        localStorage.setItem('authentication','true');
        localStorage.setItem('token',res.token);
        this.router.navigate(['home']);
        this.presentToast('Login Successful','success');
      }
      else{
        this.commonService.authStatus = false;
        this.presentToast(res.message,'danger');
      }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    },async (error_res: any)=>{
      await loading.dismiss();
      console.log(error_res);
      this.errorMessage=error_res.error.message;
      this.presentToast(error_res.error.message,'danger');
    });
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  async presentToast(Message: string,Color) {
    const toast = await this.toast.create({
      message: Message,
      duration: 2000,
      position: 'top',
      color: Color
    });
    toast.present();
  }*/

