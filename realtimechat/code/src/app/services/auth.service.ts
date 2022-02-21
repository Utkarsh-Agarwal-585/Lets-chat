import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import firebase, { auth } from 'firebase';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ChatPage } from '../chat/chat.page';
import { environment } from 'src/environments/environment';
//import { ChatsListPage } from '../chats-list/chats-list.page';

export interface User {
  uid: string;
  email: string;
}
export interface UserCredentials {
  fName: string;
  lName: string;
  cNo: string;
  eMail: string;
  passWord: string;
  fname: string;
}

export interface Message {
  createdAt: firebase.firestore.FieldValue;
  id: string;
  from: string;
  msg: string;
  fromName: string;
  myMsg: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements UserCredentials {
  //uid: any;
  userData: any;
  public authStatus = false;
  user: User = null;
  fName: '';
  lName: '';
  cNo: '';
  eMail: '';
  passWord: '';
  value: any;
  fname = '';
  currentUser: User = null;
  constructor(private angularFireAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    public afStore: AngularFirestore,
    public afdb: AngularFireDatabase,
    public http: HttpClient,
    private afAuth: AngularFireAuth,

  ) {
    this.afAuth.onAuthStateChanged((user: any) => {
      this.currentUser = user;
      if (user) {
        console.log(this.currentUser.uid);
      }
    });
    // this.getUserListPage().subscribe((res:any)=>{
    //   this.currentUser.uid = res.fb_uid 
    //   console.log(this.currentUser);
    // })
  }
  createUser(value) {
    console.log(value);
    console.log(this.fname);
    return new Promise<any>((resolve, reject) => {
      this.angularFireAuth.createUserWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err));
      //this.search;
    });
  }

  // search(dataToSend){
  //   var url = "http://localhost:3000/api/";
  //   return this.http.post(url+'signup',dataToSend,{headers:new HttpHeaders(
  //     {"content-type":"application/json"})});
  // }
  signinUser(value) {

    return new Promise<any>((resolve, reject) => {
      this.angularFireAuth.signInWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err));
    });
  }
  getCurrentUser() {
   return new Promise<any>((resolve,reject)=>{
    this.angularFireAuth.currentUser.then((res)=>{
      //console.log(res);
      resolve(res);
    },
    (err)=>{
      reject(err);
    }
    );
   })
  }
  registerInBackend(res) {
    var url = environment.base_url + 'api/register';
    return this.http.post(url,res);
  }
  getUserListPage(){
    //console.log(res);
    var list_url = environment.base_url + 'api/list';
    return this.http.get(list_url);
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  AuthLogin(provider) {
    return this.angularFireAuth.signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          console.log('authStatus', this.firebaseAuthCheck());
          this.router.navigate(['dashboard']);
        });
        this.SetUserData(result.user);
      }).catch((error) => {
        window.alert(error);
      });
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(`users/${user.uid}`);
  }

  signoutUser() {
    return new Promise<void>((resolve, reject) => {
      if (this.angularFireAuth.currentUser) {
        this.angularFireAuth.signOut()
          .then(() => {
            console.log('Sign out');
            resolve();
          }).catch(() => {
            reject();
          });
      }
    });
  }

  userDetails() {
    console.log(this.angularFireAuth.user);
    return this.angularFireAuth.user;
  }
  firebaseAuthCheck() {
    if (firebase.auth().currentUser) {
      console.log(firebase.auth().currentUser);
      this.authStatus = true;
      return this.authStatus;
    } else {
      // console.log('authStatus',this.authStatus);
      this.authStatus = false;
      return this.authStatus;
    }
  }
  signOut() {
    return this.angularFireAuth.signOut();
  }
  get authenticated(): boolean {
    return this.user !== null;
  }

  get currentUserId(): string {
    return this.authenticated ? this.user.uid : '';
  }

  updateUser(fName, lName, cNo, eMail) {
    console.log(firebase.auth().currentUser.uid);
    return this.afdb.object(`/users/` + firebase.auth().currentUser.uid).update({ fname: fName, lname: lName, contactno: cNo, email: eMail });


  }

  getProfile() {
    return this.afdb.object(`users/${firebase.auth().currentUser.uid}`);
  }

  /*signOut() {
    return this.angularFireAuth.signOut();
  }*/


}
