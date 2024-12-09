import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Playlist, Tracks } from '../interfaces/playlist.interface';

@Injectable({
  providedIn: 'root',
})
export class SpotifyPlaylistService {
  private readonly _baseUrl = 'https://api.spotify.com/v1/playlists';

  constructor(private _http: HttpClient) {}

  getPlaylist(playlistId: string): Observable<Playlist> {
    return this._http.get<Playlist>(`${this._baseUrl}/${playlistId}`);
  }

  getPlaylistTracks(
    playlistId: string,
    limit: number,
    offset: number
  ): Observable<Tracks> {
    return this._http.get<Tracks>(
      `${this._baseUrl}/${playlistId}/tracks?limit=${limit}&offset=${offset}`
    );
  }
}
