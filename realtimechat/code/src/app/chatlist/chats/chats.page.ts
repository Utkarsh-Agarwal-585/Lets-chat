import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';


@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {

  users:{};
  constructor(
    private router: Router,
    private chatService: ChatService,
    private authservice: AuthService,
    public navCtrl:NavController,
    private socket : Socket
  ) { }
 

  ngOnInit() {
    this.socket.connect();
    this.chatService.getRooms().then((res:any) => {
      this.users = res.data;
      console.log( res); 
    });
  
  }

  getLists(){
   
  }
  goToChat(user) {
    this.socket.connect();
    console.log(user);
    const data = { id: user.value.fb_uid, name: user.value.fullname };
    console.log(data.name);
    this.router.navigate(['/chat', data]);
  }
  

}
