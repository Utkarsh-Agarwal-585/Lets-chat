import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthguardGuard } from './authguard.guard';
import { PicturesComponent } from './pictures/pictures.component';



const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthguardGuard]
  },
  {
    path: 'registration',
    loadChildren: () => import('./registration/registration.module').then( m => m.RegistrationPageModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule),
  },
  {
    path: 'money',
    loadChildren: () => import('./money/money.module').then( m => m.MoneyPageModule)
  },
  {
    path:'pictures',
    component:PicturesComponent
  },
  {
    path: 'modal-pic',
    loadChildren: () => import('./modal-pic/modal-pic.module').then( m => m.ModalPicPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'chatlist',
    loadChildren: () => import('./chatlist/chatlist.module').then( m => m.ChatlistPageModule)
  },
  {
    path: 'chats-list',
    loadChildren: () => import('./chats-list/chats-list.module').then( m => m.ChatsListPageModule)
  },
  {
    path: 'chat-settings',
    loadChildren: () => import('./chat-settings/chat-settings.module').then( m => m.ChatSettingsPageModule)
  },
  {
    path: 'project-details',
    loadChildren: () => import('./project-details/project-details.module').then( m => m.ProjectDetailsPageModule)
  },
  {
    path: 'task-details',
    loadChildren: () => import('./task-details/task-details.module').then( m => m.TaskDetailsPageModule)
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
