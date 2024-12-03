import { Component, HostListener } from '@angular/core';
import { Album, Artist, Track } from '../../interfaces/search.interface';
import { SpotifySearchService } from '../../services/spotify.search.service';
import { catchError, of } from 'rxjs';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SpotifyPlayerService } from '../../services/spotify.player.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, NgIf, FormsModule, RouterModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  query: string = '';
  searchType: 'track' | 'artist' | 'album' = 'track';
  tracks: Track[] = [];
  artists: Artist[] = [];
  albums: Album[] = [];
  errorMessage: string = '';
  resultsOpen: boolean = true;
  track: Track | null = null;

  constructor(
    private _spotifySearchService: SpotifySearchService,
    private _eRef: ElementRef,
    private _spotifyPlayerService: SpotifyPlayerService
  ) {}

  onSearch(): void {
    this.search();
  }

  playTrack(track: Track): void {
    this._spotifyPlayerService
      .playTrack(track.uri)
      .pipe(
        catchError((error) => {
          console.error(`Error playing track: ${track.name}`, error);
          return of(null);
        })
      )
      .subscribe(() => {
        console.log(`Playing track: ${track.name}`);
      });
  }

  getArtistsString(artists: Artist[]): string {
    return artists.map((artist) => artist.name).join(', ');
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this._eRef.nativeElement.contains(event.target)) {
      this.resultsOpen = false;
      this.query = '';
    }
  }
  private search() {
    if (this.query) {
      this.resultsOpen = true;
      this._spotifySearchService
        .search(this.query, this.searchType)
        .pipe(
          catchError((error) => {
            console.error('Error fetching search results:', error);
            this.errorMessage =
              'Failed to fetch search results. Please try again.';
            this.clearResults();
            return of(null);
          })
        )
        .subscribe((response) => {
          if (response) {
            this.clearResults();
            if (this.searchType === 'track') {
              this.tracks = response.tracks.items;
            } else if (this.searchType === 'artist') {
              this.artists = response.artists.items;
            } else if (this.searchType === 'album') {
              this.albums = response.albums.items;
            }
          }
        });
    } else {
      this.resultsOpen = false;
    }
  }
  private clearResults(): void {
    this.tracks = [];
    this.artists = [];
    this.albums = [];
  }
}
