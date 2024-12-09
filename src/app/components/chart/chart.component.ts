import { NgIf } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { SpotifyApiService } from '../../services/spotify.api.service';
import { catchError, of } from 'rxjs';
import { ChartData } from '../../interfaces/chart.data.interface';
import {
  UserTopTracks,
  UserTopTracksResponse,
} from '../../interfaces/user.top.tracks.interface';
import { SpotifyErrorHandlerService } from '../../services/spotify.error.handler.service';
Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [NgIf],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent implements OnInit {
  private chart!: Chart;
  error = signal<string | null>(null);

  constructor(
    private _spotifyApiService: SpotifyApiService,
    private _spotifyErrorHandlerService: SpotifyErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.initializeChart();
  }

  getUserTopTracks(): void {
    this._spotifyApiService
      .getTopTracks()
      .pipe(
        catchError(() => {
          this._spotifyErrorHandlerService.showError(
            'Error loading top tracks',
            5000
          );
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          this._spotifyErrorHandlerService.showSuccess(
            'Top tracks fetched into chart',
            1000
          );
          const chartData = this.mapResponseToChartData(response);
          this.updateChart(chartData);
          this.error.set(null);
        }
      });
  }

  private shortenText(text: string, maxLength: number): string {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  }
  private initializeChart(): void {
    const ct = document.getElementById('spotifyChart') as HTMLCanvasElement;
    this.chart = new Chart(ct, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Track popularity',
            data: [],
            backgroundColor: '#1DB954',
            borderColor: '#1ED760',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: '#ffffff',
              font: {
                size: 14,
                family: 'Arial, sans-serif',
              },
            },
          },
          tooltip: {
            callbacks: {
              title: (tooltipItems) => {
                const index = tooltipItems[0].dataIndex;
                return this.chart.data.labels?.[index] as string;
              },
            },
            backgroundColor: '#191414',
            titleColor: '#FFFFFF',
            bodyColor: '#FFFFFF',
            borderColor: '#1ED760',
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            ticks: {
              callback: (value, index) => {
                const label = this.chart.data.labels?.[index] as string;
                return this.shortenText(label, 15);
              },
              color: '#ffffff',
              font: {
                size: 12,
                family: 'Arial, sans-serif',
              },
              maxRotation: 90,
              minRotation: 45,
            },
            grid: {
              color: '#333333',
            },
          },
          y: {
            ticks: {
              color: '#ffffff',
              font: {
                size: 12,
                family: 'Arial, sans-serif',
              },
            },
            grid: {
              color: '#333333',
            },
          },
        },
      },
    });
  }

  private mapResponseToChartData(response: UserTopTracksResponse): ChartData {
    return {
      labels: response.items.map((track: UserTopTracks) => track.name),
      datasets: [
        {
          label: 'Track Popularity',
          data: response.items.map((track: UserTopTracks) => track.popularity),
          backgroundColor: response.items.map(() => '#1DB954'),
          borderColor: response.items.map(() => '#1ED760'),
          borderWidth: 2,
        },
      ],
    };
  }
  private updateChart(chartData: ChartData): void {
    if (!this.chart || !this.chart.data) {
      this._spotifyErrorHandlerService.showError(
        'Chart instance is not initialized properly',
        5000
      );
    }
    this.chart.data.labels = chartData.labels;
    this.chart.data.datasets = chartData.datasets;
    this.chart.update();
  }
}
