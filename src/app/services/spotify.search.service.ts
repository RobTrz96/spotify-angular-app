import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpotifySearchService {
  private readonly _baseUrl = 'https://api.spotify.com/v1';

  constructor(private _http: HttpClient) {}

  search(query: string, type: string): Observable<any> {
    return this._http
      .get<any>(
        `${this._baseUrl}/search?q=${encodeURIComponent(
          query
        )}&type=${type}&limit=5`
      )
      .pipe(
        catchError((error) => {
          console.error(`Error fetching ${type} results: `, error);
          return of({
            [type]: {
              items: [],
              total: 0,
              limit: 0,
              offset: 0,
              next: '',
              previous: '',
            },
          });
        })
      );
  }
}
