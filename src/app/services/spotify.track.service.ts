import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { __param } from 'tslib';
import { TrackObject } from '../interfaces/track.object.interface';

@Injectable({
  providedIn: 'root',
})
export class SpotifyTrackService {
  private readonly baseUri = 'https://api.spotify.com/v1';

  constructor(private _http: HttpClient) {}

  getTrackDetails(trackId: string): Observable<TrackObject> {
    const url = `${this.baseUri}/tracks/${trackId}`;
    return this._http.get<TrackObject>(url);
  }
}
