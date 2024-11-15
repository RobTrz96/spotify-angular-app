import { Component } from '@angular/core';
import { SpotifyAuthService } from '../../services/spotify.auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private _spotifyAuthService: SpotifyAuthService) {}

  login(): void {
    this._spotifyAuthService.redirectToAuthCodeFlow();
  }
}
