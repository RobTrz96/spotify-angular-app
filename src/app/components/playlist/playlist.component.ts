import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PlayerComponent } from '../player/player.component';
import { SpotifyPlaylistService } from '../../services/spotify.playlist.service';
import { SpotifyPlayerService } from '../../services/spotify.player.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyErrorHandlerService } from '../../services/spotify.error.handler.service';
import { Item, Playlist, Track } from '../../interfaces/playlist.interface';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [CommonModule, PlayerComponent],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.scss',
})
export class PlaylistComponent implements OnInit {
  Math = Math;
  playlistId: string | null = null;
  playlist: Playlist | null = null;
  tracks: Item[] = [];
  currentPage: number = 1;
  limit: number = 20;
  totalTracks: number = 0;

  constructor(
    private _spotifyPlaylistService: SpotifyPlaylistService,
    private _spotifyPlayerService: SpotifyPlayerService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _spotifyErrorHandlerService: SpotifyErrorHandlerService
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.playlistId = this.sanitizePlaylistId(
      this._route.snapshot.paramMap.get('id')!
    );
    this.getPlaylistDetails();
    this.getPlaylistTracks();
  }

  onTrackClick(item: Item): void {
    this._spotifyPlayerService
      .playTrack(item.track.uri)
      .pipe(
        catchError(() => {
          this._spotifyErrorHandlerService.showError(
            `Error playing track: ${item.track.name}`,
            5000
          );
          return of(null);
        })
      )
      .subscribe((result) => {
        if (result) {
          this._spotifyErrorHandlerService.showSuccess(
            `Playing track: ${item.track.name}`,
            3000
          );
        }
      });
  }

  redirectToHome(): void {
    this._router.navigate(['/']);
  }

  nextPage(): void {
    if (this.currentPage * this.limit < this.totalTracks) {
      this.currentPage++;
      this.getPlaylistTracks();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getPlaylistTracks();
    }
  }
  playPlaylist(playlistUri: string): void {
    this._spotifyPlayerService
      .playPlaylist(playlistUri)
      .pipe(
        catchError(() => {
          this._spotifyErrorHandlerService.showError(
            'Failed to start playback:',
            5000
          );
          return of(null);
        })
      )
      .subscribe((result) => {
        if (result)
          this._spotifyErrorHandlerService.showSuccess(
            `Playing playlist: ${playlistUri}`,
            1000
          );
      });
  }
  private getPlaylistDetails(): void {
    this._spotifyPlaylistService
      .getPlaylist(this.playlistId!)
      .pipe(
        catchError(() => {
          this._spotifyErrorHandlerService.showError(
            'Error fetching playlist details!',
            5000
          );
          return of(null);
        })
      )
      .subscribe((playlist) => {
        if (playlist) {
          this.playlist = playlist;
          this.totalTracks = playlist.tracks.total;
        }
      });
  }

  private sanitizePlaylistId(playlistId: string): string {
    return playlistId.replace('spotify:playlist:', '');
  }
  private getPlaylistTracks(): void {
    const offset = (this.currentPage - 1) * this.limit;
    this._spotifyPlaylistService
      .getPlaylistTracks(this.playlistId!, this.limit, offset)
      .pipe(
        catchError(() => {
          this._spotifyErrorHandlerService.showError(
            'Error fetching playlist tracks',
            5000
          );
          return of({ items: [], total: 0, limit: 0, offset: 0 });
        })
      )
      .subscribe((tracks) => {
        if ('items' in tracks) {
          this.tracks = tracks.items;
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
