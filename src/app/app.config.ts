import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
// ✅ Fixed: Using the correct file name you actually have
import { httpConfigInterceptor } from './shared/http.interceptor'; 

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([httpConfigInterceptor])),
    provideRouter(routes)
  ] 
};