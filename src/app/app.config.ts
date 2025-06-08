import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { routes } from './app.routes';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { authInterceptorFn } from './auth/auth-interceptor';

export function tokenGetter() {
  return localStorage.getItem('token');
}

export const appConfig = {
  providers: [
     importProvidersFrom(NgbModule),
    provideRouter(routes),
    JwtHelperService,
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter,
          allowedDomains: ['localhost:7296'], // el back
          disallowedRoutes: []
        }
      })
    ),
    provideHttpClient(
      withInterceptors([authInterceptorFn]) //aquí se registra la función
    )
  ]
};
