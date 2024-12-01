import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RecentlyPlayedTracksResponse } from '../interfaces/recently.played.tracks.interface';
import { UserTopArtistsResponse } from '../interfaces/user.top.artists.interface';

@Injectable({
  providedIn: 'root',
})
export class SpotifyApiService {
  private readonly _baseUri = 'https://api.spotify.com/v1';

  constructor(private _http: HttpClient) {}

  getRecentlyPlayed(): Observable<RecentlyPlayedTracksResponse> {
    return this._http.get<RecentlyPlayedTracksResponse>(
      `${this._baseUri}/me/player/recently-played`
    );
  }

  getTopArtists(): Observable<UserTopArtistsResponse> {
    return this._http.get<UserTopArtistsResponse>(
      `${this._baseUri}/me/top/artists`
    );
  }
}
