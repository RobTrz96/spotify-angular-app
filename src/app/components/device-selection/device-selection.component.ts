import { Component, OnInit } from '@angular/core';
import { SpotifyPlayerService } from '../../services/spotify.player.service';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-device-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './device-selection.component.html',
  styleUrl: './device-selection.component.scss',
})
export class DeviceSelectionComponent implements OnInit {
  devices: any[] = [];
  private _refreshInterval: Subscription | undefined;
  private _token: string = localStorage.getItem('access_token') || '';

  constructor(private _spotifyPlayerService: SpotifyPlayerService) {}

  ngOnInit(): void {
    this.loadDevices();
    this.startAutoRefresh();
  }

  loadDevices(): void {
    if (this._token) {
      this._spotifyPlayerService.getAvailableDevices(this._token).subscribe(
        (data: any) => {
          this.devices = data.devices;
        },
        (error) => console.error('Error obtaining device list!', error)
      );
    } else {
      console.log('Authorization token not found!');
    }
  }

  startAutoRefresh(): void {
    this._refreshInterval = interval(10000).subscribe(() => {
      this.loadDevices();
    });
  }

  selectDevice(deviceId: string): void {
    if (this._token) {
      this._spotifyPlayerService
        .transferPlayback(this._token, deviceId)
        .subscribe(
          () => {
            console.log(`Playback transferred to device: ${deviceId}`);
          },
          (error) => console.error('Error obtaining device list!', error)
        );
    } else {
      console.log('Authorization token not found!');
    }
  }
}
