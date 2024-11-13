import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { SpotifyAuthService } from '../../services/spotify.auth.service';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [],
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.scss',
})
export class CallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private spotifyAuthService: SpotifyAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params) => {
      const code = params['code'];
      if (code) {
        this.spotifyAuthService.getAccessToken(code).subscribe(
          (token) => {
            this.spotifyAuthService.saveToken(token);
            const url = new URL(window.location.href);
            url.searchParams.delete('code');
            window.history.replaceState({}, document.title, url.toString());
            this.router.navigate(['/user']);
          },
          (error) => {
            console.error('Error obtaining access token!', error);
          }
        );
      } else {
        console.error('Authorization code not found!');
        this.router.navigate(['/login']);
      }
    });
  }
}
// export class CallbackComponent implements OnInit {
//   constructor(
//     private route: ActivatedRoute,
//     private spotifyAuthService: SpotifyAuthService,
//     private router: Router
//   ) {}

//   async ngOnInit() {
//     const code = this.route.snapshot.queryParamMap.get('code');
//     if (code) {
//       try {
//         const token = await this.spotifyAuthService.getAccessToken(
//           this.spotifyAuthService.clientId,
//           code
//         );
//         this.spotifyAuthService.saveToken(token);

//         const url = new URL(window.location.href);
//         url.searchParams.delete('code');
//         window.history.replaceState({}, document.title, url.toString());

//         this.router.navigate(['/user']);
//       } catch (error) {
//         console.error('Error exchanging code for token:', error);
//         this.router.navigate(['/login']);
//       }
//     } else {
//       console.error('Authorization code not found in the URL');
//       this.router.navigate(['/login']);
//     }
//   }
// }
