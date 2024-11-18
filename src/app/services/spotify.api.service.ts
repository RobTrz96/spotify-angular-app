import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpotifyApiService {
  private _baseUri = 'https://api.spotify.com/v1';

  constructor(private _http: HttpClient) {}

  getHeaders(token: string): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getFeaturedPlaylists(token: string) {
    return this._http.get(`${this._baseUri}/browse/featured-playlists`, {
      headers: this.getHeaders(token),
    });
  }

  getRecentlyPlayed(token: string) {
    return this._http.get(`${this._baseUri}/me/player/recently-played`, {
      headers: this.getHeaders(token),
    });
  }

  getTopArtists(token: string) {
    return this._http.get(`${this._baseUri}/me/top/artists`, {
      headers: this.getHeaders(token),
    });
  }
}
