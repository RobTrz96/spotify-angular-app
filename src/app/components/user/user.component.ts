import { Component, OnInit } from '@angular/core';
import { SpotifyUserService } from '../../services/spotify.user.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { SpotifyPlayerService } from '../../services/spotify.player.service';
import { Router } from '@angular/router';
import { PlayerComponent } from '../player/player.component';
import { UserProfile } from '../../interfaces/current.user.profile.interface';
import { catchError, of } from 'rxjs';
import {
  CurrentUserPlaylists,
  CurrentUserPlaylistsResponse,
} from '../../interfaces/current.user.playlists.interface';
import { SpotifyErrorHandlerService } from '../../services/spotify.error.handler.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, MatCardModule, PlayerComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  userProfile: UserProfile | null = null;
  playlists: CurrentUserPlaylists[] = [];

  constructor(
    public router: Router,
    private _spotifyUserService: SpotifyUserService,
    private _spotifyPlayerService: SpotifyPlayerService,
    private _spotifyErrorHandlerService: SpotifyErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.getData();
    this.getPlaylists();
  }

  playPlaylist(playlistUri: string): void {
    this._spotifyPlayerService
      .playPlaylist(playlistUri)
      .pipe(
        catchError(() => {
          this._spotifyErrorHandlerService.showError(
            'Error starting playlist playback:',
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
  private getData(): void {
    this._spotifyUserService
      .getUserProfile()
      .pipe(
        catchError(() => {
          this._spotifyErrorHandlerService.showError(
            'Error obtaining user data!',
            5000
          );
          return of(null);
        })
      )
      .subscribe((profile: UserProfile | null) => {
        if (profile) {
          this.userProfile = profile;
        } else {
          this._spotifyErrorHandlerService.showError(
            'No user profile data received.',
            5000
          );
        }
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
}
