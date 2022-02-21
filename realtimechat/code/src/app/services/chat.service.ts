import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { switchMap, map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from './auth.service';
import { ChatPage } from '../chat/chat.page';
import { ChatsPage } from '../chatlist/chats/chats.page';
import { Socket } from 'ngx-socket-io';
 
export interface User {
  uid: string;
  email: string;
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
export class ChatService {
  users = {};
  currentUser: User = null;
  messagesCollection: AngularFirestoreCollection<any[]>;
  messages: Observable<any[]>;
  constructor(private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private authService: AuthService,
    private afdb: AngularFireDatabase,
    private socket :Socket
    //private chat: ChatPage
  ) {
    this.afAuth.onAuthStateChanged((user: any) => {
      this.currentUser = user;
      if (user) {
        console.log(this.currentUser.uid);
      }
    });
  }

  // async signup({ email, password }): Promise<any> {
  //   const credential = await this.afAuth.createUserWithEmailAndPassword(
  //     email,
  //     password
  //   );

  //   const uid = credential.user.uid;

  //   return this.afs.doc(
  //     `users/${uid}`
  //   ).set({
  //     uid,
  //     email: credential.user.email,
  //   })
  // }

  // signIn({ email, password }) {
  //   return this.afAuth.signInWithEmailAndPassword(email, password);
  // }
  signOut(): Promise<void> {
    return this.afAuth.signOut();
  }

  // TODO Chat functionality

  // Chat functionality

  // addChatMessage(msg) {
  //   console.log(this.currentUser.uid);
  //   return this.afs.collection('chatroom/').add({
  //     msg,
  //     from: this.currentUser.uid,
  //     //createdAt: firebase.firestore.FieldValue.serverTimestamp()
  //     createdAt: firebase.firestore.FieldValue.serverTimestamp()
  //   });
  // }

  // addmsg(){
  //   return this.socket.emit('')
  // }
  addChatdataMessage(msg,chatroomid) {
    console.log(typeof chatroomid);
    console.log('chatroom/' + chatroomid);
    return this.afdb.list('chatroom/' + chatroomid).push({
      msg: msg,
      from: this.currentUser.uid,
     createdAt: firebase.database.ServerValue.TIMESTAMP

    });
  }

  // getChatMessages(chatroomid) {
  //   console.log('chatroom/' + chatroomid);
  //   let users= [];
  //   return this.getUsers().pipe(
  //     switchMap(res => {
  //       users = res;
  //       return this.afdb.list('chatroom/' + chatroomid).valueChanges() as Observable<Message[]>;

  //     }),
  //     map(messages => {
  //       // Get the real name for each user
  //       for (let m of messages) {
  //         console.log(m);
  //        // m.fromName = this.getUserForMsg(m.from, users);
  //         m.fromName = m.from;
  //         m.myMsg = this.currentUser.uid === m.from;
  //       }
  //       return messages;
  //     })
  //   );
  // }

  private getUsers() {
    return this.afs.collection('users').valueChanges({ idField: 'uid' }) as Observable<User[]>;
  }

  private getUserForMsg(msgFromId, users: User[]): string {
    for (let usr of users) {
      if (usr.uid == msgFromId) {
        return usr.email;
      }
    }
    // return 'Deleted';
  }

  getOneGroup(id, user_group_key = null) {
    return this.afs.doc(`groups/${id}`).snapshotChanges().pipe(
      take(1),
      map(changes => {
        const data = changes.payload.data();
        const group_id = changes.payload.id;
        return { user_group_key, id: group_id, data };
      })
    )
  }

  getRooms() {
    console.log(this.afdb.list('users'));
    // return this.afdb.list('users/').valueChanges();
    // return  new Promise((resolve, reject) => {
    //   this.afdb.database.ref('users/').on('value', (data) => {
    //     var obj = data.val();
    //     console.log(obj);
    //     resolve(obj);
    //     Object.keys(obj).forEach((key) => {
    //       console.log('key: ' + key);
    //     });
    //   });
    return  new Promise((resolve, reject) => {
      this.authService.getUserListPage().subscribe((res)=>{ 
        this.users = res;
        console.log(this.users);
        resolve(res);
      })
        
      })
      
     

      
    // })
  }

  getChatRoomMsg(chatroomid,toUserName){
    console.log(chatroomid);
    return this.afdb.list('chatroom/'+chatroomid).valueChanges().pipe(
    map(messages => {
      // Get the real name for each user
      for (let m of messages) {
        console.log(m);
       // m.fromName = this.getUserForMsg(m.from, users);
        
        if(this.currentUser.uid === m['from']){
          m['myMsg'] = true;
          m['fromName'] = 'You';
        }else{
          m['myMsg'] = false;
          m['fromName'] = toUserName;
        }
        
      }
      return messages
    })
    );

    // return this.authService.getUserListPage('chatroom/').pipe(
    //   map(res => {
    //     //   // Get the real name for each user
        
    //       for (let m of messages) {
    //         console.log(m);
    //        // m.fromName = this.getUserForMsg(m.from, users);
            
    //         if(this.currentUser.uid === m['from']){
    //           m['myMsg'] = true;
    //           m['fromName'] = 'You';
    //         }else{
    //           m['myMsg'] = false;
    //           m['fromName'] = toUserName;
    //         }
            
    //       }
    //       return messages
    //     })
    // );
  }
}