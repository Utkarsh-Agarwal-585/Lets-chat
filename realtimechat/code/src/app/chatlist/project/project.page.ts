import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project',
  templateUrl: './project.page.html',
  styleUrls: ['./project.page.scss'],
})
export class ProjectPage implements OnInit {
  projects:any = [];
  
  
  constructor(private router: Router ) { 
    this.projects = [
    {name: "Ionic", msg: "This is Ionic Project"},
    {name: "Angular", msg: "This is Angular Project"},
    {name: "Firebase", msg: "This is Firebase Project"},
    {name: "Socket", msg: "This is Socket.io Project"},
    {name: "Node js", msg: "This is Nodejs Project"},
    {name: "TypeScript", msg: "This is TypeScript Project"}
   ];
  }

  ngOnInit() {
  }
  goToChat(user) {
    console.log(user);
    const data = { id: user.key, name: user.value.name };
    this.router.navigate(['/project-details', data]);
  }

}
