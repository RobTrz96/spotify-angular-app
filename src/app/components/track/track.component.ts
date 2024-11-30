import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { TrackObject } from '../../interfaces/track.object.interface';
import { SpotifyTrackService } from '../../services/spotify.track.service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { DurationPipe } from '../../pipes/duration.pipe';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-track',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    DurationPipe,
  ],
  templateUrl: './track.component.html',
  styleUrl: './track.component.scss',
})
export class TrackComponent implements OnInit {
  @Input() trackId: string = '';
  trackDetails: TrackObject | null = null;
  artistNames: string = '';
  isLoading = true;
  isPlaying = false;

  constructor(private _spotifyTrackService: SpotifyTrackService) {}

  ngOnInit(): void {
    console.log('Track ID:', this.trackId);
    if (this.trackId) {
      this.fetchTrackDetails();
    }
  }

  private fetchTrackDetails(): void {
    this._spotifyTrackService
      .getTrackDetails(this.trackId)
      .pipe(
        catchError((error) => {
          console.error('Error fetching track details:', error);
          return of(null);
        })
      )
      .subscribe((details) => {
        if (details) {
          this.trackDetails = details;
          this.artistNames = this.trackDetails.artists
            .map((artist) => artist.name)
            .join(', ');
        }
        this.isLoading = false;
      });
  }
}
