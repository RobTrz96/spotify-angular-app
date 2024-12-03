import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
  standalone: true,
})
export class DurationPipe implements PipeTransform {
  transform(value: number): string {
    if (!value) return '0:00';

    const minutes = Math.floor(value / 60000);
    const seconds = Math.floor((value % 60000) / 1000);

    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${minutes}:${formattedSeconds}`;
  }
}
