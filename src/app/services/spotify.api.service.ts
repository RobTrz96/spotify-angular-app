import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RecentlyPlayedTracksResponse } from '../interfaces/recently.played.tracks.interface';
import { UserTopArtistsResponse } from '../interfaces/user.top.artists.interface';
import { FeaturedPlaylistsRepsonse } from '../interfaces/featured.playlists.interface';

@Injectable({
  providedIn: 'root',
})
export class SpotifyApiService {
  private _baseUri = 'https://api.spotify.com/v1';

  constructor(private _http: HttpClient) {}

  getFeaturedPlaylists(token: string): Observable<FeaturedPlaylistsRepsonse> {
    return this._http.get<FeaturedPlaylistsRepsonse>(
      `${this._baseUri}/browse/featured-playlists`,
      {
        headers: this.getHeaders(token),
      }
    );
  }

  getRecentlyPlayed(token: string): Observable<RecentlyPlayedTracksResponse> {
    return this._http.get<RecentlyPlayedTracksResponse>(
      `${this._baseUri}/me/player/recently-played`,
      {
        headers: this.getHeaders(token),
      }
    );
  }

  getTopArtists(token: string): Observable<UserTopArtistsResponse> {
    return this._http.get<UserTopArtistsResponse>(
      `${this._baseUri}/me/top/artists`,
      {
        headers: this.getHeaders(token),
      }
    );
  }

  private getHeaders(token: string): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
