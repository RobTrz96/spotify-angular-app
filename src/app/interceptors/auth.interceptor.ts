import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { SpotifyAuthService } from '../services/spotify.auth.service';

export const spotifyAuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const spotifyAuthService = inject(SpotifyAuthService);

  const token = spotifyAuthService.getToken();
  if (token) {
    if (!spotifyAuthService.validateTokenWithServer()) {
      console.warn('Token is invalid or expired. Redirecting to login...');
      spotifyAuthService.logout();
      return throwError(() => new Error('Token is invalid or expired.'));
    }
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(clonedRequest).pipe(
      catchError((error) => {
        if (error.status === 401) {
          console.warn('Token unauthorized. Redirecting to login...');
          spotifyAuthService.logout();
        }
        return throwError(() => error);
      })
    );
  }
  console.warn('No token found. Redirecting to login...');
  spotifyAuthService.logout();
  return next(req);
};
