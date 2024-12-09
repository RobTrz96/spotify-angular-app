import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SpotifyAlbumService } from '../../services/spotify.album.service';
import { Album, Item } from '../../interfaces/album.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { PlayerComponent } from '../player/player.component';
import { SpotifyPlayerService } from '../../services/spotify.player.service';
import { SpotifyErrorHandlerService } from '../../services/spotify.error.handler.service';

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
    private _router: Router,
    private _spotifyErrorHandlerService: SpotifyErrorHandlerService
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
        catchError(() => {
          this._spotifyErrorHandlerService.showError(
            `Error playing track: ${track.name}`,
            5000
          );
          return of(null);
        })
      )
      .subscribe((result) => {
        if (result)
          this._spotifyErrorHandlerService.showSuccess(
            `Playing track: ${track.name}`,
            3000
          );
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
        catchError(() => {
          this._spotifyErrorHandlerService.showError(
            'Error fetching album details!',
            5000
          );
          return of(null);
        })
      )
      .subscribe((album) => {
        this.album = album;
      });
  }

  private getAlbumTracks(): void {
    const offset = (this.currentPage - 1) * this.limit;
    this._spotifyAlbumService
      .getAlbumTracks(this.albumId!, this.limit, offset)
      .pipe(
        catchError(() => {
          this._spotifyErrorHandlerService.showError(
            'Error fetching album tracks',
            5000
          );
          return of({ tracks: [] });
        })
      )
      .subscribe((tracks) => {
        if ('items' in tracks) {
          this.tracks = tracks.items;
          this.totalTracks = tracks.total;
        } else {
          this._spotifyErrorHandlerService.showError(
            'No tracks to fetch',
            5000
          );
          this.tracks = [];
        }
      });
  }
}
