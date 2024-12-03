import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SpotifyAlbumService } from '../../services/spotify.album.service';
import { Album, Item } from '../../interfaces/album.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { PlayerComponent } from '../player/player.component';
import { SpotifyPlayerService } from '../../services/spotify.player.service';

@Component({
  selector: 'app-album',
  standalone: true,
  imports: [CommonModule, NgIf, PlayerComponent],
  templateUrl: './album.component.html',
  styleUrl: './album.component.scss',
})
export class AlbumComponent implements OnInit {
  Math = Math;
  albumId: string | null = null;
  album: Album | null = null;
  tracks: Item[] = [];
  currentPage: number = 1;
  limit: number = 20;
  totalTracks: number = 0;
  constructor(
    private _spotifyAlbumService: SpotifyAlbumService,
    private _spotifyPlayerService: SpotifyPlayerService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.albumId = this._route.snapshot.paramMap.get('id')!;
    this.getAlbumDetails();
    this.getAlbumTracks();
  }

  onTrackClick(track: Item): void {
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

  redirectToHome(): void {
    this._router.navigate(['/']);
  }

  nextPage(): void {
    if (this.currentPage * this.limit < this.totalTracks) {
      this.currentPage++;
      this.getAlbumTracks();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getAlbumTracks();
    }
  }
  private getAlbumDetails(): void {
    this._spotifyAlbumService
      .getAlbum(this.albumId!)
      .pipe(
        catchError((error) => {
          console.error('Error fetching album details!', error);
          return of(null);
        })
      )
      .subscribe((album) => {
        if (album) {
          this.album = album;
        } else {
          console.log('Album data is unavailable');
        }
      });
  }

  private getAlbumTracks(): void {
    const offset = (this.currentPage - 1) * this.limit;
    this._spotifyAlbumService
      .getAlbumTracks(this.albumId!, this.limit, offset)
      .pipe(
        catchError((error) => {
          console.error('Error fetching album tracks:', error);
          return of({ tracks: [] });
        })
      )
      .subscribe((tracks) => {
        if ('items' in tracks) {
          this.tracks = tracks.items;
          this.totalTracks = tracks.total;
        } else {
          this.tracks = [];
        }
      });
  }
}
