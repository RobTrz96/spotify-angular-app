import { Component, OnInit } from '@angular/core';
import { SpotifyArtistService } from '../../services/spotify.artist.service';
import { Artist } from '../../interfaces/artist.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { catchError, of } from 'rxjs';
import { ArtistTopTracks } from '../../interfaces/artist.top.tracks.interface';
import { ArtistAlbums } from '../../interfaces/artist.albums.interface';
import { PlayerComponent } from '../player/player.component';
import { SpotifyPlayerService } from '../../services/spotify.player.service';
import { Track } from '../../interfaces/recently.played.tracks.interface';
import { SpotifyErrorHandlerService } from '../../services/spotify.error.handler.service';

@Component({
  selector: 'app-artist',
  standalone: true,
  imports: [CommonModule, NgIf, PlayerComponent],
  templateUrl: './artist.component.html',
  styleUrl: './artist.component.scss',
})
export class ArtistComponent implements OnInit {
  artistId: string | null = null;
  artist: Artist | null = null;
  topTracks: ArtistTopTracks[] = [];
  albums: ArtistAlbums[] = [];

  constructor(
    private _spotifyArtistService: SpotifyArtistService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _spotifyPlayerService: SpotifyPlayerService,
    private _spotifyErrorHandlerService: SpotifyErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.artistId = this._route.snapshot.paramMap.get('id')!;
    this.getArtistDetails();
    this.getArtistTopTracks();
    this.getArtistAlbums();
  }

  redirectToHome(): void {
    this._router.navigate(['/']);
  }

  onTrackClick(track: Track): void {
    this._spotifyPlayerService
      .playTrack(track.uri)
      .pipe(
        catchError(() => {
          this._spotifyErrorHandlerService.showError(
            `Error playing track: ${track.name}`,
            5000
          );
          return of(null);
        })
      )
      .subscribe((result) => {
        if (result)
          this._spotifyErrorHandlerService.showSuccess(
            `Playing track: ${track.name}`,
            1000
          );
      });
  }

  onAlbumClick(albumId: string): void {
    this._router.navigate(['/album', albumId]);
  }

  private getArtistDetails(): void {
    this._spotifyArtistService
      .getArtist(this.artistId!)
      .pipe(
        catchError(() => {
          this._spotifyErrorHandlerService.showError(
            'Error fetching artist details!',
            5000
          );
          return of(null);
        })
      )
      .subscribe((artist) => {
        this.artist = artist;
      });
  }

  private getArtistTopTracks(): void {
    this._spotifyArtistService
      .getArtistTopTracks(this.artistId!)
      .pipe(
        catchError(() => {
          this._spotifyErrorHandlerService.showError(
            'Error fetching artist top tracks:',
            5000
          );
          return of({ tracks: [] });
        })
      )
      .subscribe((response) => {
        this.topTracks = response.tracks;
      });
  }

  private getArtistAlbums(): void {
    this._spotifyArtistService
      .getArtistAlbums(this.artistId!)
      .pipe(
        catchError(() => {
          this._spotifyErrorHandlerService.showError(
            'Error fetching artist albums:',
            5000
          );
          return of({ items: [] });
        })
      )
      .subscribe((response) => {
        this.albums = response.items;
      });
  }
}
