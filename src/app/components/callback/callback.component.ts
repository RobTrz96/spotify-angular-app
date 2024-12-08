import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { SpotifyAuthService } from '../../services/spotify.auth.service';
import { catchError, of } from 'rxjs';
import { SpotifyErrorHandlerService } from '../../services/spotify.error.handler.service';

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
    private _router: Router,
    private _spotifyErrorHandlerService: SpotifyErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.callback();
  }

  private callback(): void {
    this._route.queryParams.subscribe((params) => {
      const code = params['code'];
      if (code) {
        this._spotifyAuthService
          .getAccessToken(code)
          .pipe(
            catchError(() => {
              this._spotifyErrorHandlerService.showError(
                'Error obtaining access token!',
                5000
              );
              this._router.navigate(['/login']);
              return of(null);
            })
          )
          .subscribe((token) => {
            if (token) {
              this._spotifyErrorHandlerService.showSuccess(
                'Successful login',
                1000
              );
              this._spotifyAuthService.saveToken(token);
              const url = new URL(window.location.href);
              url.searchParams.delete('code');
              window.history.replaceState({}, document.title, url.toString());
              this._router.navigate(['/']);
            }
          });
      } else {
        this._spotifyErrorHandlerService.showError(
          'Authorization code not found!',
          5000
        );
        this._router.navigate(['/login']);
      }
    });
  }
}
