/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ServiceService } from '../service.service';
import { AuthService } from '../services/auth.service';
import { Socket } from 'ngx-socket-io';
import { CommonService } from '../common.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  currentUser = '';
  message = '';
  constructor(private menu: MenuController,
    private router: Router,
    private authService: AuthService,
    private socket: Socket,
    private commonSerive: CommonService) { }

  ngOnInit() {
    this.socket.connect();
    let name = `bssfsf`;
    this.currentUser = name;
    this.socket.emit('set-name', name);
    var notes = []
    var isInitNotes = false
    var socketCount = 0

    this.authService.getProfile().valueChanges().subscribe(async (res)=>{
      //append email and fb_id in to the variable res
      var user = await this.authService.getCurrentUser();
      console.log(user);
      res['email'] = user.email;
      res['uid'] = user.uid;
      this.authService.registerInBackend(res).subscribe((res)=>{
        console.log(res);
      })
      console.log(res);
    })
    this.socket.on('connection', function (socket) {
      // Socket has connected, increase socket count
      socketCount++
      // Let all sockets know how many are connected
      this.socket.emit('users connected', socketCount)
      console.log('users connected', socketCount);

      socket.on('disconnect', function () {
        // Decrease the socket count on a disconnect, emit
        socketCount--
        this.socket.emit('users connected', socketCount)
      })
      
      

      // Initial set of notes, loop through and add to list
      //this.socket.on('initial notes', function (data) 
      this.socket.fromEvent('initial notes').subscribe(data =>{
        //var html =''
        var html: string='';
        //for (var i = 0; i < data.length; i++) 
        for(var i of data){
          // We store html as a var then add to DOM after for efficiency
          html += '<li>' + data[i].note + '</li>'
          // this.html.push(data);
        }
        // $('#notes').html(html)
      });

      // New note emitted, add it to our list of current notes
      socket.on('new note', function (data) {
        // $('#notes').append('<li>' + data.note + '</li>')
      })

      // New socket connected, display new count on page
      socket.on('users connected', function (data) {
        // $('#usersConnected').html('Users connected: ' + data)
      })

    
     
    })


    // Check to see if initial query/notes are set
  }

  abc() {
    var socketCount = 0
    var newNote = 'This is a random ' + (Math.floor(Math.random() * 100) + 1) + ' note'
    this.socket.emit('new note', { note: newNote })
    console.log('new note:', newNote);
    this.socket.on('connection', function (socket) {
      // Socket has connected, increase socket count
      socketCount++
      // Let all sockets know how many are connected
      this.socket.emit('users connected', socketCount)
      console.log('users connected', socketCount);

  })}


  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }
  signOut() {
    this.authService.signoutUser()
      .then(res => {
        this.router.navigateByUrl('login');
      })
      .catch(error => {
        console.log(error);
      });
  }
  add(){
  
    this.socket.emit('status added', this.message);
    console.log('status added',this.message);
  }


}
