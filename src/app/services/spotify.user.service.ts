import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProfile } from '../interfaces/current.user.profile.interface';
import { CurrentUserPlaylistsResponse } from '../interfaces/current.user.playlists.interface';

@Injectable({
  providedIn: 'root',
})
export class SpotifyUserService {
  private readonly _baseUri = 'https://api.spotify.com/v1/me';

  constructor(private _http: HttpClient) {}

  getUserProfile(): Observable<UserProfile> {
    return this._http.get<UserProfile>(`${this._baseUri}`);
  }

  getUserPlaylists(): Observable<CurrentUserPlaylistsResponse> {
    return this._http.get<CurrentUserPlaylistsResponse>(
      `${this._baseUri}/playlists`
    );
  }
}
