import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { bootstrapApplication, provideClientHydration, provideProtractorTestingSupport } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LocalStorageService } from './local-storage.service';

   export const appConfig: ApplicationConfig = {
     providers: [
       provideZoneChangeDetection({ eventCoalescing: true }),
       provideRouter(routes),
       provideClientHydration(),
       provideProtractorTestingSupport(),
       HttpClientModule,
       DragDropModule,
       LocalStorageService
     ]
   };