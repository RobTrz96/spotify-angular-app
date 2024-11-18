import { Component, OnInit } from '@angular/core';
import { SpotifyUserService } from '../../services/spotify.user.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { SpotifyPlayerService } from '../../services/spotify.player.service';
import { Router } from '@angular/router';
import { PlayerComponent } from '../player/player.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, MatCardModule, PlayerComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  userData: any;
  playlists: any[] = [];
  private token: string | null = localStorage.getItem('access_token');

  constructor(
    private _spotifyUserService: SpotifyUserService,
    private _spotifyPlayerService: SpotifyPlayerService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getData();
    this.getPlaylists();
  }

  getData(): void {
    if (this.token) {
      this._spotifyUserService.getUserData(this.token).subscribe({
        next: (data) => (this.userData = data),
        error: (error) => console.error('Error obtaining user data!', error),
      });
    } else {
      console.error('Authorization token not found!');
    }
  }

  getPlaylists(): void {
    if (this.token) {
      this._spotifyUserService.getUserPlaylists(this.token).subscribe({
        next: (data) => (this.playlists = data.items),
        error: (error) =>
          console.error('Error obtaining user playlists!', error),
      });
    } else {
      console.error('Authorization token not found!');
    }
  }

  playPlaylist(playlistUri: string): void {
    this._spotifyPlayerService
      .playPlaylist(this.token!, playlistUri)
      .subscribe();
  }
}
