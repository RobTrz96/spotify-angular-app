import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Artist } from '../interfaces/artist.interface';
import { ArtistTopTrackResponse } from '../interfaces/artist.top.tracks.interface';
import { ArtistAlbumsResponse } from '../interfaces/artist.albums.interface';

@Injectable({
  providedIn: 'root',
})
export class SpotifyArtistService {
  private readonly _baseUri = 'https://api.spotify.com/v1';

  constructor(private _http: HttpClient) {}

  getArtist(id: string): Observable<Artist> {
    return this._http.get<Artist>(`${this._baseUri}/artists/${id}`);
  }

  getArtistTopTracks(
    artistId: string,
    country: string = 'PL'
  ): Observable<ArtistTopTrackResponse> {
    return this._http.get<ArtistTopTrackResponse>(
      `${this._baseUri}/artists/${artistId}/top-tracks?market=${country}`
    );
  }

  getArtistAlbums(artistId: string): Observable<ArtistAlbumsResponse> {
    return this._http
      .get<ArtistAlbumsResponse>(`${this._baseUri}/artists/${artistId}/albums`)
      .pipe(
        map((response) => {
          response.items.sort((a, b) => {
            const dateA = new Date(a.release_date).getTime();
            const dateB = new Date(b.release_date).getTime();
            return dateB - dateA;
          });
          return response;
        })
      );
  }
}
