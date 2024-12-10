import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SelectDeviceResponse } from '../interfaces/device.selection.interface';
import { CurrentlyPlayingResponse } from '../interfaces/current.track.interface';

@Injectable({
  providedIn: 'root',
})
export class SpotifyPlayerService {
  private readonly _baseUrl = 'https://api.spotify.com/v1/me';
  constructor(private _http: HttpClient) {}

  nextTrack(): Observable<boolean> {
    return this._http
      .post<void>(
        `${this._baseUrl}/player/next`,
        {},
        { responseType: 'text' as 'json' }
      )
      .pipe(map(() => true));
  }

  previousTrack(): Observable<boolean> {
    return this._http
      .post<void>(
        `${this._baseUrl}/player/previous`,
        {},
        { responseType: 'text' as 'json' }
      )
      .pipe(map(() => true));
  }

  play(): Observable<void> {
    return this._http.put<void>(
      `${this._baseUrl}/player/play`,
      {},
      { responseType: 'text' as 'json' }
    );
  }

  pause(): Observable<void> {
    return this._http.put<void>(
      `${this._baseUrl}/player/pause`,
      {},
      { responseType: 'text' as 'json' }
    );
  }

  setVolume(volume: number): Observable<void> {
    return this._http.put<void>(
      `${this._baseUrl}/player/volume?volume_percent=${volume}`,
      {},
      {}
    );
  }

  getCurrentTrack(): Observable<CurrentlyPlayingResponse> {
    return this._http.get<CurrentlyPlayingResponse>(
      `${this._baseUrl}/player/currently-playing`,
      {}
    );
  }

  playTrack(uri: string): Observable<boolean> {
    return this._http
      .put<void>(`${this._baseUrl}/player/play`, { uris: [uri] }, {})
      .pipe(map(() => true));
  }

  playPlaylist(playlistUri: string, deviceId?: string): Observable<boolean> {
    const body: { context_uri: string; device_id?: string } = {
      context_uri: playlistUri,
    };

    if (deviceId) {
      body.device_id = deviceId;
    }

    return this._http
      .put<void>(`${this._baseUrl}/player/play`, body, {})
      .pipe(map(() => true));
  }

  getAvailableDevices(): Observable<SelectDeviceResponse> {
    return this._http.get<SelectDeviceResponse>(
      'https://api.spotify.com/v1/me/player/devices',
      {}
    );
  }

  transferPlayback(deviceId: string) {
    const body = { device_ids: [deviceId], play: true };
    return this._http.put('https://api.spotify.com/v1/me/player', body, {});
  }

  seekToPosition(positionMs: number): Observable<void> {
    return this._http.put<void>(
      `${this._baseUrl}/player/seek?position_ms=${positionMs}`,
      {}
    );
  }
}
