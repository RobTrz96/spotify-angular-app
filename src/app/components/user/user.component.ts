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
    private _spotifyPlayerService: SpotifyPlayerService
  ) {}

  ngOnInit(): void {
    this.getData();
    this.getPlaylists();
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

  private getData(): void {
    this._spotifyUserService
      .getUserProfile()
      .pipe(
        catchError((error) => {
          console.error('Error obtaining user data!', error);
          return of(null);
        })
      )
      .subscribe((profile: UserProfile | null) => {
        if (profile) {
          this.userProfile = profile;
        } else {
          console.error('No user profile data received.');
        }
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
}
