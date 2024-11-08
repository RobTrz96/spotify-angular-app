import { Component } from '@angular/core';
import { LoginComponentComponent } from '../login-component/login-component.component';
import { ProfileComponentComponent } from '../profile-component/profile-component.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [LoginComponentComponent, ProfileComponentComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {}
