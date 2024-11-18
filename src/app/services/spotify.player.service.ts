import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpotifyPlayerService {
  private _baseUrl = 'https://api.spotify.com/v1/me';
  constructor(private _http: HttpClient) {}

  getHeaders(token: string): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  play(token: string): Observable<any> {
    const headers = this.getHeaders(token);
    return this._http.put(
      `${this._baseUrl}/player/play`,
      {},
      { headers, responseType: 'text' }
    );
  }

  pause(token: string): Observable<any> {
    const headers = this.getHeaders(token);
    return this._http.put(
      `${this._baseUrl}/player/pause`,
      {},
      { headers, responseType: 'text' }
    );
  }

  nextTrack(token: string): Observable<any> {
    const headers = this.getHeaders(token);
    return this._http.post(
      `${this._baseUrl}/player/next`,
      {},
      { headers, responseType: 'text' }
    );
  }

  previousTrack(token: string): Observable<any> {
    const headers = this.getHeaders(token);
    return this._http.post(
      `${this._baseUrl}/player/previous`,
      {},
      { headers, responseType: 'text' }
    );
  }

  getCurrentTrack(token: string): Observable<any> {
    const headers = this.getHeaders(token);
    return this._http.get(
      `${this._baseUrl}/player/currently-playing`,

      { headers }
    );
  }

  setVolume(token: string, volume: number): Observable<any> {
    const headers = this.getHeaders(token);
    return this._http.put(
      `${this._baseUrl}/player/volume?volume_percent=${volume}`,
      {},
      { headers }
    );
  }

  getCurrentPlaybackState(token: string): Observable<any> {
    const headers = this.getHeaders(token);
    return this._http.get('https://api.spotify.com/v1/me/player', { headers });
  }

  playTrack(token: string, uri: string): Observable<any> {
    const headers = this.getHeaders(token);
    return this._http.put(
      `${this._baseUrl}/player/play`,
      { uris: [uri] },
      { headers }
    );
  }

  playPlaylist(
    token: string,
    playlistUri: string,
    deviceId?: string
  ): Observable<any> {
    const headers = this.getHeaders(token);
    const body: any = { context_uri: playlistUri };

    if (deviceId) {
      body.device_id = deviceId;
    }

    return this._http.put<any>(`${this._baseUrl}/player/play`, body, {
      headers,
    });
  }

  getAvailableDevices(token: string): Observable<any> {
    const headers = this.getHeaders(token);
    return this._http.get('https://api.spotify.com/v1/me/player/devices', {
      headers,
    });
  }

  transferPlayback(token: string, deviceId: string) {
    const headers = this.getHeaders(token);
    const body = { device_ids: [deviceId], play: true };
    return this._http.put('https://api.spotify.com/v1/me/player', body, {
      headers,
    });
  }
}
