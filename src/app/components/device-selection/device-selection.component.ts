import { Component, OnInit } from '@angular/core';
import { SpotifyPlayerService } from '../../services/spotify.player.service';
import { CommonModule } from '@angular/common';
import { catchError, interval, of, Subscription } from 'rxjs';
import {
  SelectDevice,
  SelectDeviceResponse,
} from '../../interfaces/device.selection.interface';
import { SpotifyErrorHandlerService } from '../../services/spotify.error.handler.service';

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

  constructor(
    private _spotifyPlayerService: SpotifyPlayerService,
    private _spotifyErrorHandlerService: SpotifyErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.loadDevices();
    this.startAutoRefresh();
  }

  selectDevice(deviceId: string): void {
    this._spotifyPlayerService
      .transferPlayback(deviceId)
      .pipe(
        catchError(() => {
          this._spotifyErrorHandlerService.showError(
            `Error transferring playback to device: ${deviceId}`,
            5000
          );
          return of(null);
        })
      )
      .subscribe(() => {
        this._spotifyErrorHandlerService.showSuccess(
          `Playback transferred to device: ${deviceId}`,
          1000
        );
      });
  }

  private loadDevices(): void {
    this._spotifyPlayerService
      .getAvailableDevices()
      .pipe(
        catchError(() => {
          this._spotifyErrorHandlerService.showError(
            'Error obtaining device list!',
            5000
          );
          return of({ devices: [] });
        })
      )
      .subscribe((data: SelectDeviceResponse) => {
        this.devices = data.devices;
      });
  }

  private startAutoRefresh(): void {
    this._refreshInterval = interval(10000).subscribe(() => {
      this.loadDevices();
    });
  }
}
