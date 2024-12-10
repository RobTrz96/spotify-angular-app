import { Component, OnInit } from '@angular/core';
import { SpotifyPlayerService } from '../../services/spotify.player.service';
import { CommonModule } from '@angular/common';
import { catchError, interval, of, Subscription } from 'rxjs';
import {
  CurrentlyPlayingResponse,
  Track,
} from '../../interfaces/current.track.interface';
import { TrackComponent } from '../track/track.component';
import { SpotifyErrorHandlerService } from '../../services/spotify.error.handler.service';
import { DurationPipe } from '../../pipes/duration.pipe';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, TrackComponent, DurationPipe],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
export class PlayerComponent implements OnInit {
  currentTrack: Track | null = null;
  isPlaying: boolean = false;
  volume: number = 50;
  showTrackDetails = false;
  progressMs: number = 0;
  private _playbackSubscription: Subscription | undefined;
  constructor(
    private _spotifyPlayerService: SpotifyPlayerService,
    private _spotifyErrorHandlerService: SpotifyErrorHandlerService
  ) {}

  ngOnInit(): void {
    const savedVolume = localStorage.getItem('spotifyVolume');
    this.volume = savedVolume ? Number(savedVolume) : 50;

    this._spotifyPlayerService
      .setVolume(this.volume)
      .pipe(this.handleError('Error setting initial volume'))
      .subscribe();
    this.loadCurrentTrack();
    this.startPollingPlaybackState();
  }

  togglePlayPause(): void {
    if (this.isPlaying) {
      this._spotifyPlayerService
        .pause()
        .pipe(this.handleError('Error pausing playback:'))
        .subscribe(() => {
          this._spotifyErrorHandlerService.showSuccess(
            'Stopped succesfully',
            500
          );
          this.isPlaying = false;
        });
    } else {
      this._spotifyPlayerService
        .play()
        .pipe(this.handleError('Error resuming playback:'))
        .subscribe(() => {
          this._spotifyErrorHandlerService.showSuccess(
            'Played successfully',
            500
          );
          this.isPlaying = true;
        });
    }
  }

  nextTrack(): void {
    this._spotifyPlayerService
      .nextTrack()
      .pipe(this.handleError('Error skipping to next track:'))
      .subscribe((result) => {
        if (result)
          this._spotifyErrorHandlerService.showSuccess(
            'Succesfully skipped to next track.',
            500
          );
      });
  }

  previousTrack(): void {
    this._spotifyPlayerService
      .previousTrack()
      .pipe(this.handleError('Error skipping to previous track:'))
      .subscribe((result) => {
        if (result)
          this._spotifyErrorHandlerService.showSuccess(
            'Succesfully skipped to previous track.',
            500
          );
      });
  }

  adjustVolume(event: Event): void {
    const target = event.target as HTMLInputElement;
    const volume = Number(target.value);
    this.volume = volume;
    localStorage.setItem('spotifyVolume', volume.toString());
    this._spotifyPlayerService
      .setVolume(volume)
      .pipe(this.handleError('Error adjusting volume'))
      .subscribe();
  }

  playPlaylist(playlistUri: string): void {
    this._spotifyPlayerService
      .playPlaylist(playlistUri)
      .pipe(this.handleError('Failed to start playback:'))
      .subscribe((result) => {
        if (result)
          this._spotifyErrorHandlerService.showSuccess(
            `Playing playlist: ${playlistUri}`,
            1000
          );
      });
  }

  viewTrackDetails(): void {
    this.showTrackDetails = true;
  }

  closeTrackDetails(): void {
    this.showTrackDetails = false;
  }

  seekTo(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const positionMs = parseInt(inputElement.value, 10);
    this._spotifyPlayerService
      .seekToPosition(positionMs)
      .pipe(this.handleError('Error seeking to position'))
      .subscribe(() => {
        this._spotifyErrorHandlerService.showSuccess(
          `Seeked to ${positionMs}ms`,
          1000
        );
      });
  }

  private updatePlaybackState(): void {
    this._spotifyPlayerService
      .getCurrentTrack()
      .pipe(
        catchError(() => {
          this._spotifyErrorHandlerService.showError(
            'Error fetching playback state:',
            5000
          );
          return of({
            item: null,
            is_playing: false,
            progress_ms: 0,
            device: null,
            repeat_state: 'off',
            shuffle_state: false,
            context: null,
          } as unknown as CurrentlyPlayingResponse);
        })
      )
      .subscribe((response: CurrentlyPlayingResponse) => {
        this.currentTrack = response.item;
        this.progressMs = response.progress_ms || 0;
      });
  }

  private loadCurrentTrack(): void {
    this._spotifyPlayerService
      .getCurrentTrack()
      .pipe(
        catchError(() => {
          this._spotifyErrorHandlerService.showError(
            'Error getting the current track!',
            5000
          );
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
  }

  private startPollingPlaybackState(): void {
    this._playbackSubscription = interval(1000)
      .pipe(this.handleError('Error polling playback state:'))
      .subscribe(() => this.updatePlaybackState());
  }

  private handleError(errorMessage: string, duration: number = 5000) {
    return catchError((error) => {
      console.error(errorMessage, error);
      this._spotifyErrorHandlerService.showError(errorMessage, duration);
      return of(null);
    });
  }
}
