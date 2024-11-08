import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpotifyAuthService {
  private clientId = '1c509bc759774b93b158762ca34d48dc';
  private redirectUri = 'http://localhost:4200/';
  private authEndpoint = 'https://accounts.spotify.com/pl/authorize';
  private tokenKey = 'spotify_auth_token';

  constructor() {}
  // client_id=1c509bc759774b93b158762ca34d48dc&response_type=token&redirect_uri=http://localhost:4200/
  login() {
    const authUrl = `${this.authEndpoint}?client_id=${this.clientId}&response_type=token&redirect_uri=${this.redirectUri}`;

    window.location.href = authUrl;
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }
}
