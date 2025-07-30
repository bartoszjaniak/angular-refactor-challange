import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store'
import { provideEffects } from '@ngrx/effects'
import {userReducer} from './store/store.reducer';
import { favoritesReducer } from './store/favorites/favorites.reducer';
import { provideStoreDevtools } from '@ngrx/store-devtools'
import { UsersEffects } from './store/store.effects'
import { FavoritesEffects } from './store/favorites/favorites.effects'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideStore({ 
      user: userReducer,
      favorites: favoritesReducer 
    }),
    provideEffects([UsersEffects, FavoritesEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
]
};
