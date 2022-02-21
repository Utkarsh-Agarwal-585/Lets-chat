import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage implements OnInit {

  task:any = [];
  
  
  constructor(private router: Router ) { 
    this.task = [
    {name: "Ionic", msg: "This is Ionic Task"},
    {name: "Angular", msg: "This is Angular Task"},
    {name: "Firebase", msg: "This is Firebase Task"},
    {name: "Socket", msg: "This is Socket.io Task"},
    {name: "Node js", msg: "This is Nodejs Task"},
    {name: "TypeScript", msg: "This is TypeScript Task"}
   ];
  }

  ngOnInit() {
  }
  goToChat(user) {
    console.log(user);
    const data = { id: user.key, name: user.value.name };
    this.router.navigate(['/task-details', data]);
  }
}
