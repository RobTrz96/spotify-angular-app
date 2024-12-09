import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SpotifyErrorHandlerService {
  constructor(private _snackBar: MatSnackBar) {}
  showError(message: string, duration: number): void {
    this._snackBar.open(message, 'Close', {
      duration,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
  showSuccess(message: string, duration: number): void {
    this._snackBar.open(message, 'Close', {
      duration,
      panelClass: 'success-snackbar',
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
