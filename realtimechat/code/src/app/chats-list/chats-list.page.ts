import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chats-list',
  templateUrl: './chats-list.page.html',
  styleUrls: ['./chats-list.page.scss'],
})
export class ChatsListPage implements OnInit {

  users = {};
  msg: any;
  constructor(
    private chatService: ChatService,
    private router: Router,
    private afdb: AngularFireDatabase,
    private authservice : AuthService
  ) { }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  ngOnInit() {
    // this.chatService.getRooms().then((res) => {
    //   this.users = res;
    //   console.log(res);
    // });
   
    this.afdb.database.ref('chatroom').on('value', (data) => {
      const obj = data.val();
      //console.log(data.hasChild());
      Object.keys(obj).forEach((key) => {
        console.log('key: ' + key);
      });
    });
  
  }
  goToChat(user) {
    console.log(user);
    const data = { id: user.key, name: user.value.fname };
    this.router.navigate(['/chat', data]);
  }

}


