/* eslint-disable object-shorthand */
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController, NavParams, IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ChatService } from '../services/chat.service';
import { LoginPage } from '../login/login.page';
import * as firebase from 'firebase/app';
import { AngularFireDatabase } from '@angular/fire/database';
import { PopoverController } from '@ionic/angular';
import { PopovercompComponent } from '../popovercomp/popovercomp.component';
import { ChatsPage } from '../chatlist/chats/chats.page';
import { Socket } from 'ngx-socket-io';


//import { ChatsListPage } from '../chats-list/chats-list.page';
/*export const snapshotToArray = snapshot => {
  const returnArr = [];

  snapshot.forEach(childSnapshot => {
      const item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
  });

  return returnArr;
};*/


@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  @ViewChild(IonContent) content: IonContent;
  messages: any[];
  newMsg = '';
  uidFrom = this.chatService.currentUser.uid;
  uidTo = '';
  chatroomid = '';
  // eslint-disable-next-line @typescript-eslint/naming-convention
  from_to = '';
  currentUser = '';
  cr_id = '';
  chatmsg = '';

  // eslint-disable-next-line @typescript-eslint/ban-types
  // eslint-disable-next-line @typescript-eslint/naming-convention
  chat_room_id = '';
  toUserName = '';
  users: {};
  chatRoom = {};
 
  // eslint-disable-next-line @typescript-eslint/member-ordering
  constructor(
    private chatService: ChatService,
    private router: Router,
    private afdb: AngularFireDatabase,
    private route: ActivatedRoute,
    public popoverc: PopoverController,
    private socket: Socket,
  ) { }
  ngOnInit() {
    this.socket.connect();
   
    // this.chatService.getRooms().then((res:any) => {
    //   this.users = res.data.fullname;
    //   console.log( res); 
    // });


    //  socket.on('newnotes', function () {
    let chatRoomId = this.uidFrom + '-' + this.uidTo;
    //     // Set the default chat room id this.chat_room_id = chatroomid
    this.chat_room_id = chatRoomId;


    // this.messages = this.chatService.getChatMessages();
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.uidTo = params.get('id'); //Get the 'to id' from the selected user
      console.log(this.uidTo);
      this.uidFrom = this.chatService.currentUser.uid;
      console.log('uidfrom', this.uidFrom)
      let chat_fromid = this.uidFrom;
      let chat_toid = this.uidTo;

      this.socket.emit('GetChatRoom',{
        from_id: chat_fromid,
        to_id: chat_toid 
      });

      // Get Chat room data
      this.socket.on('ChatRoom',(res)=>{
        console.log('ChatRoom',res);
        this.chatRoom = res;
      });


      console.log('chat fromtoid', {chat_fromid,chat_toid});
      this.toUserName = params.get('name'); //Get the 'to user name' from the selected user
      this.getRoomMessage();
      //this.chatids();
    });
  }
  async popclick(event) {
    const popover = await this.popoverc.create({
      component: PopovercompComponent,
      event
    });
    return await popover.present();
  }

  sendMessage() {
    this.uidFrom = this.chatService.currentUser.uid;
    console.log('uidfrom', this.uidFrom)

    this.socket.emit('send',{
      from_id: this.uidFrom,
      cr_id: this.chatRoom['cr_id'],
      msg: this.newMsg
    });
    //console.log('chat fromid', {chat_from,newsms});
  }
  // chatids(){
  //   this.socket.on('connect', function () {
  //     this.socket.emit('join', {email: "user@example.com"});
  //   });
  //   this.socket.on("message", function(data) {
  //     alert(data.msg);
  //   });
  // }

  getRoomMessage() {
    // Find out the chat room id is already exist !
    // Create the first combination of the chatroom id and find out is this chatroom already exist ?
    // Create a local varaible like chatroomid = from_uid+'-'+to_uid


    let chatRoomId = this.uidFrom + '-' + this.uidTo;

    this.chat_room_id = chatRoomId;





    // Check the existance of this chat room in firebase, Ex: chatroom/+chatroomid
    this.chatService.getChatRoomMsg(this.chat_room_id, this.toUserName)
      .subscribe((res) => {
        console.log(res);
        // this.socket.emit('get notess', { result: chatRoomId });
        // console.log('get notess', { result: chatRoomId})
        // If data availabe then set the this.chat_room_id as from_uid+to_uid combination
        if (res.length > 0) {
          this.messages = res;
          // this.socket.emit('get notess', { result: chatRoomId });
          // console.log('get notess', { result: chatRoomId})
        }

        // If the response contain any data or non empty array, then we can consider this as the chat room id
      });

    // Create a varaible like chatroomid = to_uid+'-'+from_uid
    chatRoomId = this.uidTo + '-' + this.uidFrom;
    this.chatService.getChatRoomMsg(chatRoomId, this.toUserName)
      .subscribe((res) => {
        console.log(res);
        // If data availabe then set the this.chat_room_id as to_uid+from_uid combination
        if (res.length > 0) {
          this.messages = res;
          this.chat_room_id = chatRoomId;
          // this.socket.emit('get notess', { result: chatRoomId });
          // console.log('get notess', { result: chatRoomId})
        }
        // If the response contain any data or non empty array, then we can consider this as the chat room id
      });



    //let to_from = this.uidTo + '-' + this.uidFrom;
    //this.messages = this.chatService.getChatMessages(to_from);

  }


  // sendMessage() {
  //   // Get the values of message, from id, datetime
  //   // 2.3.2 Push this data into firebase realtime db into the node called chatroom/+this.chat_room_id
  //   // this.chatService.addChatMessage(this.newMsg).then(() => {
  //   //   this.newMsg = '';
  //   //   this.content.scrollToBottom(100);
  //   // });
   
    
  //   // var messagetext = document.getElementById('send');
  //   // console.log(messagetext)
  //   this.chatService.addChatdataMessage(this.newMsg, this.chat_room_id).then(() => {
  //     this.newMsg = '';
  //     this.content.scrollToBottom(100);
  //   });
  // }

  signOut() {
    this.chatService.signOut().then(() => {
      this.router.navigateByUrl('/chats-list', { replaceUrl: true });
    });
  }


}

