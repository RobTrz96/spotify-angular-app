import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpotifyUserService {
  private _baseUri = 'https://api.spotify.com/v1/me';

  constructor(private _http: HttpClient) {}

  getHeaders(token: string): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getUserData(token: string): Observable<any> {
    const headers = this.getHeaders(token);
    return this._http.get<any>(`${this._baseUri}`, { headers });
  }

  getUserPlaylists(token: string): Observable<any> {
    const headers = this.getHeaders(token);
    return this._http.get<any>(`${this._baseUri}/playlists`, { headers });
  }
}
