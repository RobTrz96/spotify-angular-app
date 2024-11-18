import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpotifyApiService } from '../../services/spotify.api.service';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';
import { PlayerComponent } from '../player/player.component';
import { DeviceSelectionComponent } from '../device-selection/device-selection.component';
import { SpotifyPlayerService } from '../../services/spotify.player.service';

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
  featuredPlaylists: any[] = [];
  recentlyPlayed: any[] = [];
  topArtists: any[] = [];
  private _token: string = localStorage.getItem('access_token') || '';

  constructor(
    private _spotifyApiService: SpotifyApiService,
    private _spotifyPlayerService: SpotifyPlayerService,
    public _router: Router
  ) {}

  ngOnInit(): void {
    this.getTopPlaylists();
    this.getUserRecentTracks();
    this.getUserTopArtists();
  }

  getTopPlaylists(): void {
    if (this._token) {
      this._spotifyApiService.getFeaturedPlaylists(this._token).subscribe(
        (data: any) => {
          this.featuredPlaylists = data.playlists.items;
        },
        (error) => {
          console.error('Error obtaining featured playlists!', error);
        }
      );
    } else {
      console.error('Authorization token not found!');
    }
  }

  getUserRecentTracks(): void {
    if (this._token) {
      this._spotifyApiService.getRecentlyPlayed(this._token).subscribe(
        (data: any) => {
          this.recentlyPlayed = data.items.map((item: any) => item.track);
        },
        (error) => {
          console.error('Error obtaining users recently played tracks!', error);
          this._router.navigate(['/login']);
        }
      );
    } else {
      console.error('Authorization token not found!');
    }
  }

  onTrackClick(track: any): void {
    this._spotifyPlayerService.playTrack(this._token, track.uri).subscribe({
      next: () => console.log(`Playing track: ${track.name}`),
    });
  }

  onPlaylistClick(playlist: any): void {
    this._spotifyPlayerService
      .playPlaylist(this._token, playlist.uri)
      .subscribe({
        next: () => console.log(`Playing playlist: ${playlist.name}`),
      });
  }

  getUserTopArtists(): void {
    if (this._token) {
      this._spotifyApiService.getTopArtists(this._token).subscribe(
        (data: any) => {
          this.topArtists = data.items;
        },
        (error) => {
          console.error('Error obtaining users top artists!', error);
          this._router.navigate(['/login']);
        }
      );
    } else {
      console.error('Authorization token not found!');
    }
  }
}
