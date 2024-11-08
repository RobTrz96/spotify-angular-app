import { Component, OnInit } from '@angular/core';
import { SpotifyAuthService } from '../spotify.auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callback-component',
  standalone: true,
  imports: [],
  templateUrl: './callback-component.component.html',
  styleUrl: './callback-component.component.scss',
})
export class CallbackComponentComponent implements OnInit {
  constructor(
    private spotifyAuthService: SpotifyAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const hash = window.location.hash;
    const token = new URLSearchParams(hash.replace('#', '?')).get(
      'access_token'
    );

    if (token) {
      this.spotifyAuthService.setToken(token);
      this.router.navigate(['/']);
    } else {
      console.error('Token not found.');
    }
  }
}
