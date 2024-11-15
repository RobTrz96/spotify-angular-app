import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { SpotifyAuthService } from '../../services/spotify.auth.service';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [],
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.scss',
})
export class CallbackComponent implements OnInit {
  constructor(
    private _route: ActivatedRoute,
    private _spotifyAuthService: SpotifyAuthService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._route.queryParams.subscribe(async (params) => {
      const code = params['code'];
      if (code) {
        this._spotifyAuthService.getAccessToken(code).subscribe(
          (token) => {
            this._spotifyAuthService.saveToken(token);
            const url = new URL(window.location.href);
            url.searchParams.delete('code');
            window.history.replaceState({}, document.title, url.toString());
            this._router.navigate(['/user']);
          },
          (error) => {
            console.error('Error obtaining access token!', error);
          }
        );
      } else {
        console.error('Authorization code not found!');
        this._router.navigate(['/login']);
      }
    });
  }
}
