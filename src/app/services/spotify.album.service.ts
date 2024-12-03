import { Injectable } from '@angular/core';
import { Album, Tracks } from '../interfaces/album.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpotifyAlbumService {
  private readonly _baseUri = 'https://api.spotify.com/v1';

  constructor(private _http: HttpClient) {}

  getAlbum(albumId: string): Observable<Album> {
    return this._http.get<Album>(`${this._baseUri}/albums/${albumId}`);
  }

  getAlbumTracks(
    albumId: string,
    limit: number = 20,
    offset: number = 0
  ): Observable<Tracks> {
    return this._http.get<Tracks>(
      `${this._baseUri}/albums/${albumId}/tracks?limit=${limit}&offset=${offset}`
    );
  }
}
