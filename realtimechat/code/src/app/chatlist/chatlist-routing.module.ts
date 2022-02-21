import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatlistPage } from './chatlist.page';



const routes: Routes = [
  {
    path: 'chatlist',
    component: ChatlistPage,
    children: [
      {
        path: 'project',
        loadChildren: () => import('./project/project.module').then( m => m.ProjectPageModule)
      },
      {
        path: 'tasks',
        loadChildren: () => import('./tasks/tasks.module').then( m => m.TasksPageModule)
      },
      {
        path: 'chats',
        loadChildren: () => import('./chats/chats.module').then( m => m.ChatsPageModule)
      },
      {
        path: '',
        redirectTo: 'chatlist/chats',
        pathMatch: 'full'
      }
    ]

  },
  {
    path: '',
    redirectTo: 'chatlist/chats',
    pathMatch: 'full'
  }





   /*children: [
      {
        path: 'chat',
        children: [
          {
            path: '',
            loadChildren: '../chat/chat.module#ChatlistPageModule'
          }
        ]
      },
      {
        path: 'project',
        children: [
          {
            path: '',
            loadChildren: '../project/project.module#ProjectPageModule'
          }
        ]
      },{
        
        path: 'tasks',
        children: [
          {
            path: '',
            loadChildren: '../tasks/tasks.module#TasksPageModule'
          }
        ]
      },{
        path: '',
        redirectTo: '/chatlist/chat',
        pathMatch: 'full'
      }
    ]*/
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatlistPageRoutingModule {}
