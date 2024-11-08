import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { CallbackComponentComponent } from './callback-component/callback-component.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: 'callback', component: CallbackComponentComponent },
  { path: '', component: HomePageComponent, title: 'Home Page' },
];
