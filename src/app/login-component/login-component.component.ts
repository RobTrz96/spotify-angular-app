import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthInterceptor } from '../interceptors/auth.interceptor';
import { SpotifyAuthService } from '../spotify.auth.service';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [],
  templateUrl: './login-component.component.html',
  styleUrl: './login-component.component.scss',
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class LoginComponentComponent {
  constructor(private spotifyAuthService: SpotifyAuthService) {}
  login() {
    this.spotifyAuthService.login();
  }
}
