import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProfile } from '../interfaces/current.user.profile.interface';
import { CurrentUserPlaylistsResponse } from '../interfaces/current.user.playlists.interface';

@Injectable({
  providedIn: 'root',
})
export class SpotifyUserService {
  private _baseUri = 'https://api.spotify.com/v1/me';

  constructor(private _http: HttpClient) {}

  getUserProfile(token: string): Observable<UserProfile> {
    const headers = this.getHeaders(token);
    return this._http.get<UserProfile>(`${this._baseUri}`, { headers });
  }

  getUserPlaylists(token: string): Observable<CurrentUserPlaylistsResponse> {
    const headers = this.getHeaders(token);
    return this._http.get<CurrentUserPlaylistsResponse>(
      `${this._baseUri}/playlists`,
      { headers }
    );
  }

  private getHeaders(token: string): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
