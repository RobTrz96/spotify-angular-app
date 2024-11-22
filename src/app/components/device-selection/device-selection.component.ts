import { Component, OnInit } from '@angular/core';
import { SpotifyPlayerService } from '../../services/spotify.player.service';
import { CommonModule } from '@angular/common';
import { catchError, interval, of, Subscription } from 'rxjs';
import {
  SelectDevice,
  SelectDeviceResponse,
} from '../../interfaces/device.selection.interface';

@Component({
  selector: 'app-device-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './device-selection.component.html',
  styleUrl: './device-selection.component.scss',
})
export class DeviceSelectionComponent implements OnInit {
  devices: SelectDevice[] = [];
  private _refreshInterval: Subscription | undefined;

  constructor(private _spotifyPlayerService: SpotifyPlayerService) {}

  ngOnInit(): void {
    this.loadDevices();
    this.startAutoRefresh();
  }

  selectDevice(deviceId: string): void {
    this._spotifyPlayerService
      .transferPlayback(deviceId)
      .pipe(
        catchError((error) => {
          console.error('Error transferring playback to device!', error);
          return of(null);
        })
      )
      .subscribe(() => {
        console.log(`Playback transferred to device: ${deviceId}`);
      });
  }

  private loadDevices(): void {
    this._spotifyPlayerService
      .getAvailableDevices()
      .pipe(
        catchError((error) => {
          console.error('Error obtaining device list!', error);
          return of({ devices: [] });
        })
      )
      .subscribe((data: SelectDeviceResponse) => {
        this.devices = data.devices;
      });
  }

  private startAutoRefresh(): void {
    this._refreshInterval = interval(1500).subscribe(() => {
      this.loadDevices();
    });
  }
}
