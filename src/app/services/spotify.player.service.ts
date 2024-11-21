import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  SelectDevice,
  SelectDeviceResponse,
} from '../interfaces/device.selection.interface';
import { CurrentlyPlayingResponse } from '../interfaces/current.track.interface';

@Injectable({
  providedIn: 'root',
})
export class SpotifyPlayerService {
  private _baseUrl = 'https://api.spotify.com/v1/me';
  constructor(private _http: HttpClient) {}

  nextTrack(token: string): Observable<void> {
    const headers = this.getHeaders(token);
    return this._http.post<void>(
      `${this._baseUrl}/player/next`,
      {},
      { headers, responseType: 'text' as 'json' }
    );
  }

  previousTrack(token: string): Observable<void> {
    const headers = this.getHeaders(token);
    return this._http.post<void>(
      `${this._baseUrl}/player/previous`,
      {},
      { headers, responseType: 'text' as 'json' }
    );
  }

  play(token: string): Observable<void> {
    const headers = this.getHeaders(token);
    return this._http.put<void>(
      `${this._baseUrl}/player/play`,
      {},
      { headers, responseType: 'text' as 'json' }
    );
  }

  pause(token: string): Observable<void> {
    const headers = this.getHeaders(token);
    return this._http.put<void>(
      `${this._baseUrl}/player/pause`,
      {},
      { headers, responseType: 'text' as 'json' }
    );
  }

  setVolume(token: string, volume: number): Observable<void> {
    const headers = this.getHeaders(token);
    return this._http.put<void>(
      `${this._baseUrl}/player/volume?volume_percent=${volume}`,
      {},
      { headers }
    );
  }

  getCurrentTrack(token: string): Observable<CurrentlyPlayingResponse> {
    const headers = this.getHeaders(token);
    return this._http.get<CurrentlyPlayingResponse>(
      `${this._baseUrl}/player/currently-playing`,
      { headers }
    );
  }

  playTrack(token: string, uri: string): Observable<void> {
    const headers = this.getHeaders(token);
    return this._http.put<void>(
      `${this._baseUrl}/player/play`,
      { uris: [uri] },
      { headers }
    );
  }

  playPlaylist(
    token: string,
    playlistUri: string,
    deviceId?: string
  ): Observable<void> {
    const headers = this.getHeaders(token);
    const body: { context_uri: string; device_id?: string } = {
      context_uri: playlistUri,
    };

    if (deviceId) {
      body.device_id = deviceId;
    }

    return this._http.put<void>(`${this._baseUrl}/player/play`, body, {
      headers,
    });
  }

  getAvailableDevices(token: string): Observable<SelectDeviceResponse> {
    const headers = this.getHeaders(token);
    return this._http.get<SelectDeviceResponse>(
      'https://api.spotify.com/v1/me/player/devices',
      { headers }
    );
  }

  transferPlayback(token: string, deviceId: string) {
    const headers = this.getHeaders(token);
    const body = { device_ids: [deviceId], play: true };
    return this._http.put('https://api.spotify.com/v1/me/player', body, {
      headers,
    });
  }

  private getHeaders(token: string): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
