import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpotifyApiService } from '../../services/spotify.api.service';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';
import { PlayerComponent } from '../player/player.component';
import { DeviceSelectionComponent } from '../device-selection/device-selection.component';
import { SpotifyPlayerService } from '../../services/spotify.player.service';
import {
  RecentlyPlayedTracks,
  RecentlyPlayedTracksResponse,
  Track,
} from '../../interfaces/recently.played.tracks.interface';
import {
  UserTopArtists,
  UserTopArtistsResponse,
} from '../../interfaces/user.top.artists.interface';
import { catchError, of } from 'rxjs';
import {
  CurrentUserPlaylists,
  CurrentUserPlaylistsResponse,
} from '../../interfaces/current.user.playlists.interface';
import { SpotifyUserService } from '../../services/spotify.user.service';
import { SearchComponent } from '../search/search.component';
import { ChartComponent } from '../chart/chart.component';
import { SpotifyErrorHandlerService } from '../../services/spotify.error.handler.service';
import { QueueComponent } from '../queue/queue.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    LoginComponent,
    PlayerComponent,
    DeviceSelectionComponent,
    SearchComponent,
    ChartComponent,
    QueueComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  playlists: CurrentUserPlaylists[] = [];
  recentlyPlayed: RecentlyPlayedTracks[] = [];
  topArtists: UserTopArtists[] = [];
  private _message: string = '';
  constructor(
    public router: Router,
    private _spotifyApiService: SpotifyApiService,
    private _spotifyPlayerService: SpotifyPlayerService,
    private _spotifyUserService: SpotifyUserService,
    private _spotifyErrorHandlerService: SpotifyErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.getUserRecentTracks();
    this.getPlaylists();
    this.getUserTopArtists();
  }

  onTrackClick(track: Track): void {
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

  onArtistClick(artistId: string): void {
    this.router.navigate(['/artist', artistId]);
  }

  onPlaylistClick(playlistId: string): void {
    this.router.navigate(['/playlist', playlistId]);
  }

  private getUserTopArtists(): void {
    this._spotifyApiService
      .getTopArtists()
      .pipe(
        catchError(() => {
          this._spotifyErrorHandlerService.showError(
            'Error obtaining users top artists!',
            5000
          );
          return of({
            href: '',
            limit: 0,
            next: '',
            offset: 0,
            previous: '',
            total: 0,
            items: [],
          } as UserTopArtistsResponse);
        })
      )
      .subscribe((response: UserTopArtistsResponse) => {
        this.topArtists = response.items;
      });
  }

  private getPlaylists(): void {
    this._spotifyUserService
      .getUserPlaylists()
      .pipe(
        catchError(() => {
          this._spotifyErrorHandlerService.showError(
            'Error fetching user playlists:',
            5000
          );
          return of({ items: [] });
        })
      )
      .subscribe((response: CurrentUserPlaylistsResponse) => {
        this.playlists = response.items;
      });
  }

  private getUserRecentTracks(): void {
    this._spotifyApiService
      .getRecentlyPlayed()
      .pipe(
        catchError(() => {
          this._spotifyErrorHandlerService.showError(
            'Error obtaining users recently played tracks!',
            5000
          );
          return of({
            href: '',
            limit: 0,
            next: '',
            cursors: { before: '', after: '' },
            total: 0,
            items: [],
          } as RecentlyPlayedTracksResponse);
        })
      )
      .subscribe((response: RecentlyPlayedTracksResponse) => {
        this.recentlyPlayed = response.items;
      });
  }
}
