import { Routes } from '@angular/router';
import { CallbackComponent } from './components/callback/callback.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { UserComponent } from './components/user/user.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Home route
  { path: 'login', component: LoginComponent }, // Login route
  { path: 'callback', component: CallbackComponent }, // Callback route
  { path: 'user', component: UserComponent }, // User profile route
  { path: '**', redirectTo: '' }, // Redirect unknown paths to home
];
