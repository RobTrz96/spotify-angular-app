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

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, TrackComponent],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
})
export class PlayerComponent implements OnInit {
  currentTrack: Track | null = null;
  isPlaying: boolean = false;
  volume: number = 50;
  showTrackDetails = false;
  private _playbackSubscription: Subscription | undefined;
  constructor(
    private _spotifyPlayerService: SpotifyPlayerService,
    private _spotifyErrorHandlerService: SpotifyErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.loadCurrentTrack();
    this.startPollingPlaybackState();
  }

  togglePlayPause(): void {
    if (this.isPlaying) {
      this._spotifyPlayerService
        .pause()
        .pipe(
          catchError(() => {
            this._spotifyErrorHandlerService.showError(
              'Error pausing playback:',
              5000
            );
            return of(null);
          })
        )
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
        .pipe(
          catchError(() => {
            this._spotifyErrorHandlerService.showError(
              'Error resuming playback:',
              5000
            );
            return of(null);
          })
        )
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
      .pipe(
        catchError(() => {
          this._spotifyErrorHandlerService.showError(
            'Error skipping to next track:',
            5000
          );
          return of(null);
        })
      )
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
      .pipe(
        catchError(() => {
          this._spotifyErrorHandlerService.showError(
            'Error skipping to previous track:',
            5000
          );
          return of(null);
        })
      )
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
    this._spotifyPlayerService
      .setVolume(volume)
      .pipe(
        catchError(() => {
          this._spotifyErrorHandlerService.showError(
            'Error adjusting volume:',
            5000
          );
          return of(null);
        })
      )
      .subscribe();
  }

  playPlaylist(playlistUri: string): void {
    this._spotifyPlayerService
      .playPlaylist(playlistUri)
      .pipe(
        catchError(() => {
          this._spotifyErrorHandlerService.showError(
            'Failed to start playback:',
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

  viewTrackDetails(): void {
    this.showTrackDetails = true;
  }

  closeTrackDetails(): void {
    this.showTrackDetails = false;
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
          return of({ item: null });
        })
      )
      .subscribe((response) => {
        this.currentTrack = response.item;
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
    this._playbackSubscription = interval(10900)
      .pipe(
        catchError(() => {
          this._spotifyErrorHandlerService.showError(
            'Error polling playback state:',
            5000
          );
          return of(null);
        })
      )
      .subscribe(() => this.updatePlaybackState());
  }
}
