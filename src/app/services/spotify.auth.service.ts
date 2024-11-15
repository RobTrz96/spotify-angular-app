import {
  HttpClient,
  HttpHeaderResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SpotifyAuthService {
  clientId = '1c509bc759774b93b158762ca34d48dc';

  constructor(private _http: HttpClient) {}

  async redirectToAuthCodeFlow(): Promise<void> {
    const verifier = this.generateCodeVerifier(128);
    const challenge = await this.generateCodeChallenge(verifier);

    localStorage.setItem('verifier', verifier);

    const params = new HttpParams()
      .set('client_id', this.clientId)
      .set('response_type', 'code')
      .set('redirect_uri', 'http://localhost:4200/callback')
      .set('scope', 'user-read-private user-read-email')
      .set('code_challenge_method', 'S256')
      .set('code_challenge', challenge);

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  getAccessToken(code: string): Observable<string> {
    const verifier = localStorage.getItem('verifier');

    const params = new HttpParams()
      .set('client_id', this.clientId)
      .set('grant_type', 'authorization_code')
      .set('code', code)
      .set('redirect_uri', 'http://localhost:4200/callback')
      .set('code_verifier', verifier!);

    const headers = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded',
    });

    return this._http
      .post<{ access_token: string }>(
        'https://accounts.spotify.com/api/token',
        params.toString(),
        {
          headers,
        }
      )
      .pipe(map((response) => response.access_token));
  }

  generateCodeVerifier(length: number): string {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  get accessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  clearToken(): void {
    localStorage.removeItem('access_token');
  }
}
