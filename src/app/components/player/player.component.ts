import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpotifyPlayerService } from '../../services/spotify.player.service';
import { CommonModule } from '@angular/common';
import { catchError, interval, of, Subscription } from 'rxjs';
import {
  CurrentlyPlayingResponse,
  Track,
} from '../../interfaces/current.track.interface';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
export class PlayerComponent implements OnInit {
  currentTrack: Track | null = null;
  isPlaying: boolean = false;
  volume: number = 50;
  private _token: string = localStorage.getItem('access_token') || '';
  private _playbackSubscription: Subscription | undefined;

  constructor(private _spotifyPlayerService: SpotifyPlayerService) {}

  ngOnInit(): void {
    this.loadCurrentTrack();
    this.startPollingPlaybackState();
  }

  togglePlayPause(): void {
    if (this.isPlaying) {
      this._spotifyPlayerService
        .pause(this._token)
        .pipe(
          catchError((error) => {
            console.error('Error pausing playback:', error);
            return of(null);
          })
        )
        .subscribe(() => (this.isPlaying = false));
    } else {
      this._spotifyPlayerService
        .play(this._token)
        .pipe(
          catchError((error) => {
            console.error('Error resuming playback:', error);
            return of(null);
          })
        )
        .subscribe(() => (this.isPlaying = true));
    }
  }

  nextTrack(): void {
    this._spotifyPlayerService
      .nextTrack(this._token)
      .pipe(
        catchError((error) => {
          console.error('Error skipping to next track:', error);
          return of(null);
        })
      )
      .subscribe(() => {
        console.log('Succesfully skipped to next track.');
      });
  }

  previousTrack(): void {
    this._spotifyPlayerService
      .previousTrack(this._token)
      .pipe(
        catchError((error) => {
          console.error('Error skipping to previous track:', error);
          return of(null);
        })
      )
      .subscribe(() => {
        console.log('Succesfully skipped to previous track.');
      });
  }

  adjustVolume(event: Event): void {
    const target = event.target as HTMLInputElement;
    const volume = Number(target.value);
    this.volume = volume;
    this._spotifyPlayerService
      .setVolume(this._token, volume)
      .pipe(
        catchError((error) => {
          console.error('Error adjusting volume:', error);
          return of(null);
        })
      )
      .subscribe();
  }

  playPlaylist(playlistUri: string): void {
    if (this._token) {
      this._spotifyPlayerService
        .playPlaylist(this._token, playlistUri)
        .pipe(
          catchError((error) => {
            console.error('Failed to start playback:', error);
            return of(null);
          })
        )
        .subscribe(() => {
          console.log(`Playing playlist: ${playlistUri}`);
        });
    } else {
      console.error('Authorization token not found!');
    }
  }

  private updatePlaybackState(): void {
    this._spotifyPlayerService
      .getCurrentTrack(this._token)
      .pipe(
        catchError((err) => {
          console.error('Error fetching playback state:', err);
          return of({ item: null });
        })
      )
      .subscribe((response) => {
        this.currentTrack = response.item;
      });
  }

  private loadCurrentTrack(): void {
    if (this._token) {
      this._spotifyPlayerService
        .getCurrentTrack(this._token)
        .pipe(
          catchError((error) => {
            console.error('Error fetching the current track!', error);
            return of({
              item: null,
              is_playing: false,
            } as CurrentlyPlayingResponse);
          })
        )
        .subscribe((response: CurrentlyPlayingResponse) => {
          this.currentTrack = response.item;
          this.isPlaying = response.is_playing;
        });
    } else {
      console.error('Authorization token not found!');
    }
  }

  private startPollingPlaybackState(): void {
    this._playbackSubscription = interval(1000)
      .pipe(
        catchError((error) => {
          console.error('Error polling playback state:', error);
          return of(null);
        })
      )
      .subscribe(() => this.updatePlaybackState());
  }
}
