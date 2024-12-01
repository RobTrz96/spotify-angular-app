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
  playlists: CurrentUserPlaylists[] = [];
  recentlyPlayed: RecentlyPlayedTracks[] = [];
  topArtists: UserTopArtists[] = [];
  private _message: string = '';

  constructor(
    public router: Router,
    private _spotifyApiService: SpotifyApiService,
    private _spotifyPlayerService: SpotifyPlayerService,
    private _spotifyUserService: SpotifyUserService
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
        catchError((error) => {
          console.error(`Error playing track: ${track.name}`, error);
          return of(null);
        })
      )
      .subscribe(() => {
        console.log(`Playing track: ${track.name}`);
      });
  }

  onArtistClick(artistId: string): void {
    this.router.navigate(['/artist', artistId]);
  }

  onPlaylistClick(playlist: CurrentUserPlaylists): void {
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

  playPlaylist(playlistUri: string): void {
    this._spotifyPlayerService
      .playPlaylist(playlistUri)
      .pipe(
        catchError((error) => {
          console.error('Error starting playlist playback:', error);
          return of(null);
        })
      )
      .subscribe({
        next: () => console.log(`Playing playlist: ${playlistUri}`),
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

  private getPlaylists(): void {
    this._spotifyUserService
      .getUserPlaylists()
      .pipe(
        catchError((error) => {
          console.error('Error fetching user playlists:', error);
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
