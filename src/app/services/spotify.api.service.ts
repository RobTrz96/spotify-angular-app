import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RecentlyPlayedTracksResponse } from '../interfaces/recently.played.tracks.interface';
import { UserTopArtistsResponse } from '../interfaces/user.top.artists.interface';
import { UserTopTracksResponse } from '../interfaces/user.top.tracks.interface';
import { QueueResponse } from '../interfaces/queue.interface';

@Injectable({
  providedIn: 'root',
})
export class SpotifyApiService {
  private readonly _baseUri = 'https://api.spotify.com/v1';

  constructor(private _http: HttpClient) {}

  getRecentlyPlayed(): Observable<RecentlyPlayedTracksResponse> {
    return this._http.get<RecentlyPlayedTracksResponse>(
      `${this._baseUri}/me/player/recently-played?limit=14`
    );
  }

  getTopArtists(): Observable<UserTopArtistsResponse> {
    return this._http.get<UserTopArtistsResponse>(
      `${this._baseUri}/me/top/artists?limit=14`
    );
  }

  getTopTracks(): Observable<UserTopTracksResponse> {
    return this._http.get<UserTopTracksResponse>(
      `${this._baseUri}/me/top/tracks?limit=10`
    );
  }

  getQueue(): Observable<QueueResponse> {
    return this._http.get<QueueResponse>(`${this._baseUri}/me/player/queue`);
  }

  getShuffleState(): Observable<boolean> {
    return this._http
      .get<any>(`${this._baseUri}/me/player`)
      .pipe(map((response) => response.shuffle_state));
  }

  shuffleQueue(state: boolean): Observable<void> {
    return this._http.put<void>(
      `${this._baseUri}/me/player/shuffle?state=${state}`,
      {},
      { responseType: 'text' as 'json' }
    );
  }

  setRepeat(state: 'track' | 'context' | 'off'): Observable<any> {
    const params = new HttpParams().set('state', state);
    return this._http.put<void>(
      `${this._baseUri}/me/player/repeat`,
      {},
      {
        params: { state },
        observe: 'response',
        responseType: 'text' as 'json',
      }
    );
  }

  getRepeatState(): Observable<'track' | 'context' | 'off'> {
    return this._http.get<any>('https://api.spotify.com/v1/me/player').pipe(
      map((response) => {
        return response.repeat_state as 'track' | 'context' | 'off';
      })
    );
  }
}
