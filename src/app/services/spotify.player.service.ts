import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SelectDeviceResponse } from '../interfaces/device.selection.interface';
import { CurrentlyPlayingResponse } from '../interfaces/current.track.interface';

@Injectable({
  providedIn: 'root',
})
export class SpotifyPlayerService {
  private _baseUrl = 'https://api.spotify.com/v1/me';
  constructor(private _http: HttpClient) {}

  nextTrack(): Observable<void> {
    return this._http.post<void>(
      `${this._baseUrl}/player/next`,
      {},
      { responseType: 'text' as 'json' }
    );
  }

  previousTrack(): Observable<void> {
    return this._http.post<void>(
      `${this._baseUrl}/player/previous`,
      {},
      { responseType: 'text' as 'json' }
    );
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

  playTrack(uri: string): Observable<void> {
    return this._http.put<void>(
      `${this._baseUrl}/player/play`,
      { uris: [uri] },
      {}
    );
  }

  playPlaylist(playlistUri: string, deviceId?: string): Observable<void> {
    const body: { context_uri: string; device_id?: string } = {
      context_uri: playlistUri,
    };

    if (deviceId) {
      body.device_id = deviceId;
    }

    return this._http.put<void>(`${this._baseUrl}/player/play`, body, {});
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
}
