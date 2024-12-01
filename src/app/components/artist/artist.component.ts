import { Component, OnInit } from '@angular/core';
import { SpotifyArtistService } from '../../services/spotify.artist.service';
import { Artist } from '../../interfaces/artist.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { catchError, of } from 'rxjs';
import { ArtistTopTracks } from '../../interfaces/artist.top.tracks.interface';
import { ArtistAlbums } from '../../interfaces/aratist.albums.interface';
import { PlayerComponent } from '../player/player.component';
import { SpotifyPlayerService } from '../../services/spotify.player.service';
import { Track } from '../../interfaces/recently.played.tracks.interface';

@Component({
  selector: 'app-artist',
  standalone: true,
  imports: [CommonModule, NgIf, PlayerComponent],
  templateUrl: './artist.component.html',
  styleUrl: './artist.component.scss',
})
export class ArtistComponent implements OnInit {
  artist: Artist | null = null;
  topTracks: ArtistTopTracks[] = [];
  albums: ArtistAlbums[] = [];

  constructor(
    private _spotifyArtistService: SpotifyArtistService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _spotifyPlayerService: SpotifyPlayerService
  ) {}

  ngOnInit(): void {
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
        catchError((error) => {
          console.error(`Error playing track: ${track.name}`, error);
          return of(null);
        })
      )
      .subscribe(() => {
        console.log(`Playing track: ${track.name}`);
      });
  }

  private getArtistDetails(): void {
    const artistId = this._route.snapshot.paramMap.get('id')!;
    this._spotifyArtistService
      .getArtist(artistId)
      .pipe(
        catchError((error) => {
          console.error('Error fetching artist details!', error);
          return of(null);
        })
      )
      .subscribe((artist) => {
        if (artist) {
          this.artist = artist;
        } else {
          console.log('Artist data is unavailable');
        }
      });
  }

  private getArtistTopTracks(): void {
    const artistId = this._route.snapshot.paramMap.get('id')!;
    this._spotifyArtistService
      .getArtistTopTracks(artistId)
      .pipe(
        catchError((error) => {
          console.error('Error fetching artist top tracks:', error);
          return of({ tracks: [] });
        })
      )
      .subscribe((response) => {
        this.topTracks = response.tracks;
      });
  }

  private getArtistAlbums(): void {
    const artistId = this._route.snapshot.paramMap.get('id')!;
    this._spotifyArtistService
      .getArtistAlbums(artistId)
      .pipe(
        catchError((error) => {
          console.error('Error fetching artist albums:', error);
          return of({ items: [] });
        })
      )
      .subscribe((response) => {
        this.albums = response.items;
      });
  }
}
