import { Routes } from '@angular/router';
import { CallbackComponent } from './components/callback/callback.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { UserComponent } from './components/user/user.component';
import { ArtistComponent } from './components/artist/artist.component';
import { AlbumComponent } from './components/album/album.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Home route
  { path: 'login', component: LoginComponent }, // Login route
  { path: 'callback', component: CallbackComponent }, // Callback route
  { path: 'user', component: UserComponent }, // User profile route
  { path: 'artist/:id', component: ArtistComponent }, // Artist route
  { path: 'album/:id', component: AlbumComponent }, // Album route
  { path: '**', redirectTo: '' }, // Redirect unknown paths to home
];
