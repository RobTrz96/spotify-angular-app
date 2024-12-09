import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { spotifyAuthInterceptor } from './app/interceptors/auth.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([spotifyAuthInterceptor])),
    provideRouter(routes),
    { provide: MatSnackBar },
    provideAnimations(),
  ],
}).catch((err) => console.error(err));
