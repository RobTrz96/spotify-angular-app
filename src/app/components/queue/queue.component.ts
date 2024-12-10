import { Component, OnInit } from '@angular/core';
import { CurrentlyPlaying } from '../../interfaces/queue.interface';
import { SpotifyApiService } from '../../services/spotify.api.service';
import { catchError, of } from 'rxjs';
import { SpotifyErrorHandlerService } from '../../services/spotify.error.handler.service';
import { NgFor, NgIf } from '@angular/common';
import { DurationPipe } from '../../pipes/duration.pipe';
import { PlayerComponent } from '../player/player.component';

@Component({
  selector: 'app-queue',
  standalone: true,
  imports: [NgIf, NgFor, DurationPipe, PlayerComponent],
  templateUrl: './queue.component.html',
  styleUrl: './queue.component.scss',
})
export class QueueComponent implements OnInit {
  Math = Math;
  queue: CurrentlyPlaying[] = [];
  currentlyPlaying: CurrentlyPlaying | null = null;
  showQueue = false;
  isRefreshing = false;
  currentPage: number = 1;
  limit: number = 8;
  totalTracks: number = 0;
  isShuffleEnabled: boolean = false;
  isRepeatEnabled: string = '';

  constructor(
    private _spotifyApiService: SpotifyApiService,
    private _spotifyErrorHandlerService: SpotifyErrorHandlerService
  ) {}

  ngOnInit(): void {
    setInterval(() => {
      if (this.showQueue) {
        this.getQueue();
        this.getShuffleState();
        this.getRepeatState();
      }
    }, 10000);
  }

  nextPage(): void {
    if (this.currentPage * this.limit < this.totalTracks) {
      this.currentPage++;
      this.getQueue();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getQueue();
    }
  }

  get paginatedQueue(): CurrentlyPlaying[] {
    const startIndex = (this.currentPage - 1) * this.limit;
    const endIndex = startIndex + this.limit;
    return this.queue.slice(startIndex, endIndex);
  }

  enableShuffle(): void {
    this._spotifyApiService
      .shuffleQueue(true)
      .pipe(
        catchError(() => {
          this._spotifyErrorHandlerService.showError(
            'Error shuffling queue',
            5000
          );
          return of(null);
        })
      )
      .subscribe(() =>
        this._spotifyErrorHandlerService.showSuccess('Shuffle enabled', 1000)
      );
  }

  disableShuffle(): void {
    this._spotifyApiService
      .shuffleQueue(false)
      .pipe(
        catchError(() => {
          this._spotifyErrorHandlerService.showError(
            'Error disabling shuffling queue',
            5000
          );
          return of(null);
        })
      )
      .subscribe(() =>
        this._spotifyErrorHandlerService.showSuccess('Shuffle disabled', 1000)
      );
  }

  viewQueue(): void {
    this.getQueue();
    this.showQueue = true;
  }

  closeQueue(): void {
    this.showQueue = false;
  }

  toggleRepeat(): void {
    let nextState: 'off' | 'context' | 'track';
    if (this.isRepeatEnabled === 'off') {
      nextState = 'context';
    } else if (this.isRepeatEnabled === 'context') {
      nextState = 'track';
    } else {
      nextState = 'off';
    }
    this._spotifyApiService
      .setRepeat(nextState)
      .pipe(
        catchError(() => {
          this._spotifyErrorHandlerService.showError(
            'Error setting repeat mode:',
            5000
          );
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          this._spotifyErrorHandlerService.showSuccess(
            `Repeat mode set to: ${nextState}`,
            1000
          );
          this.isRepeatEnabled = nextState;
        }
      });
  }

  private getQueue(): void {
    const offset = (this.currentPage - 1) * this.limit;
    this.isRefreshing = true;
    this._spotifyApiService
      .getQueue()
      .pipe(
        catchError(() => {
          this._spotifyErrorHandlerService.showError(
            'Error refreshing queue:',
            5000
          );
          return of({ currently_playing: null, queue: [] });
        })
      )
      .subscribe((data) => {
        if (data) {
          this.currentlyPlaying = data.currently_playing;
          this.queue = (data.queue || []).filter(
            (track) => track.id !== this.currentlyPlaying?.id
          );
          this.isRefreshing = false;
          this.totalTracks = this.queue.length;
        }
      });
  }

  private getRepeatState(): void {
    this._spotifyApiService
      .getRepeatState()
      .pipe(
        catchError(() => {
          this._spotifyErrorHandlerService.showError(
            'Error getting repeat state:',
            5000
          );
          this.isRepeatEnabled = 'off';
          return of('off');
        })
      )
      .subscribe((repeatState) => {
        this.isRepeatEnabled = repeatState;
      });
  }

  private getShuffleState(): void {
    this._spotifyApiService
      .getShuffleState()
      .pipe(
        catchError(() => {
          this._spotifyErrorHandlerService.showError(
            'Error getting shuffle state:',
            5000
          );
          this.isShuffleEnabled = false;
          return of(false);
        })
      )
      .subscribe((state) => {
        this.isShuffleEnabled = state;
      });
  }
}