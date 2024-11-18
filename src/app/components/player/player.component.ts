import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpotifyPlayerService } from '../../services/spotify.player.service';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
export class PlayerComponent implements OnInit {
  public currentTrack: any = null;
  public isPlaying: boolean = false;
  public volume: number = 50;
  private _token: string = localStorage.getItem('access_token') || '';
  private _playbackSubscription: Subscription | undefined;

  constructor(
    private _spotifyPlayerService: SpotifyPlayerService,
    public _router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurrentTrack();
    this.startPollingPlaybackState();
  }

  loadCurrentTrack(): void {
    if (this._token) {
      this._spotifyPlayerService
        .getCurrentTrack(this._token)
        .subscribe((data: any) => {
          this.currentTrack = data.item;
          this.isPlaying = data.is_playing;
        });
    } else {
      console.error('Authorization token not found!');
    }
  }

  togglePlayPause(): void {
    if (this.isPlaying) {
      this._spotifyPlayerService.pause(this._token).subscribe({
        next: () => {
          this.isPlaying = false;
        },
      });
    } else {
      this._spotifyPlayerService.play(this._token).subscribe({
        next: () => {
          this.isPlaying = true;
        },
      });
    }
  }

  nextTrack(): void {
    this._spotifyPlayerService.nextTrack(this._token).subscribe({
      next: () => this.loadCurrentTrack(),
    });
  }

  previousTrack(): void {
    this._spotifyPlayerService
      .previousTrack(this._token)
      .subscribe(() => this.loadCurrentTrack());
  }

  adjustVolume(event: any): void {
    const volume = event.target.value;
    this.volume = volume;
    this._spotifyPlayerService.setVolume(this._token, volume).subscribe();
  }

  startPollingPlaybackState() {
    this._playbackSubscription = interval(1000).subscribe(() => {
      this.updatePlaybackState();
    });
  }

  updatePlaybackState() {
    this._spotifyPlayerService.getCurrentTrack(this._token).subscribe({
      next: (data: any) => {
        this.currentTrack = data.item;
      },
      error: (err) => console.error('Error fetching playback state:', err),
    });
  }

  playPlaylist(playlistUri: string): void {
    if (this._token) {
      this._spotifyPlayerService
        .playPlaylist(this._token, playlistUri)
        .subscribe(
          () => {
            console.log(`Playing playlist: ${playlistUri}`);
          },
          (error) => {
            console.error('Failed to start playback:', error);
          }
        );
    } else {
      console.error('Authorization token not found!');
    }
  }
}
