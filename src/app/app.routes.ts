import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { Component } from '@angular/core';

export const routes: Routes = [
  { path: '', component: HomePageComponent, title: 'Home Page' },
];
