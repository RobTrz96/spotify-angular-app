import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpotifyApiService } from '../../services/spotify.api.service';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';
import { PlayerComponent } from '../player/player.component';
import { DeviceSelectionComponent } from '../device-selection/device-selection.component';
import { SpotifyPlayerService } from '../../services/spotify.player.service';
import {
  FeaturedPlaylistsRepsonse,
  FeaturedPlaylistItem,
} from '../../interfaces/featured.playlists.interface';
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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    LoginComponent,
    PlayerComponent,
    DeviceSelectionComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  playlists: FeaturedPlaylistItem[] = [];
  recentlyPlayed: RecentlyPlayedTracks[] = [];
  topArtists: UserTopArtists[] = [];
  private _message: string = '';

  constructor(
    public router: Router,
    private _spotifyApiService: SpotifyApiService,
    private _spotifyPlayerService: SpotifyPlayerService
  ) {}

  ngOnInit(): void {
    this.getUserRecentTracks();
    this.getTopPlaylists();
    this.getUserTopArtists();
  }

  onTrackClick(track: Track): void {
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

  onPlaylistClick(playlist: FeaturedPlaylistItem): void {
    this._spotifyPlayerService
      .playPlaylist(playlist.uri)
      .pipe(
        catchError((error) => {
          console.error(`Error playing playlist: ${playlist.name}`, error);
          return of(null);
        })
      )
      .subscribe(() => {
        console.log(`Playing playlist: ${playlist.name}`);
      });
  }

  private getUserTopArtists(): void {
    this._spotifyApiService
      .getTopArtists()
      .pipe(
        catchError((error) => {
          console.error('Error obtaining users top artists!', error);
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

  private getTopPlaylists(): void {
    this._spotifyApiService
      .getFeaturedPlaylists()
      .pipe(
        catchError((error) => {
          console.error('Error obtaining featured playlists!', error);
          return of({
            message: '',
            playlists: {
              href: '',
              limit: 0,
              next: '',
              offset: 0,
              previous: '',
              total: 0,
              items: [],
            },
          } as FeaturedPlaylistsRepsonse);
        })
      )
      .subscribe((response: FeaturedPlaylistsRepsonse) => {
        this._message = response.message;
        this.playlists = response.playlists.items;
      });
  }

  private getUserRecentTracks(): void {
    this._spotifyApiService
      .getRecentlyPlayed()
      .pipe(
        catchError((error) => {
          console.error('Error obtaining users recently played tracks!', error);
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
