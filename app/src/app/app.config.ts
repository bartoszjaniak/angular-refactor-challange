import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store'
import { provideEffects } from '@ngrx/effects'
import { usersReducer } from './store/users/users.reducer';
import { userReducer } from './store/user/user.reducer';
import { favoritesReducer } from './store/favorites/favorites.reducer';
import { provideStoreDevtools } from '@ngrx/store-devtools'
import { UsersEffects } from './store/users/users.effects'
import { UserEffects } from './store/user/user.effects'
import { FavoritesEffects } from './store/favorites/favorites.effects'
import { I18N_PROVIDERS } from './config/i18n.config';
import { I18NextModule } from 'angular-i18next';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideStore({ 
      users: usersReducer,
      user: userReducer,
      favorites: favoritesReducer 
    }),
    provideEffects([UsersEffects, UserEffects, FavoritesEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    I18NextModule.forRoot().providers || [],
    ...I18N_PROVIDERS
]
};
