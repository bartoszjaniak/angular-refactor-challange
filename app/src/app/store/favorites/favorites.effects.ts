import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, map } from 'rxjs/operators';
import {
  addUserToFavorites,
  removeUserFromFavorites,
  loadFavoritesFromStorage,
  favoritesLoadedFromStorage,
} from './favorites.actions';

@Injectable({ providedIn: 'root' })
export class FavoritesEffects {
  private actions$ = inject(Actions);

  private readonly STORAGE_KEY = 'favorite-user-ids';

  loadFavoritesFromStorage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadFavoritesFromStorage),
      map(() => {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        const favoriteUserIds: number[] = stored ? JSON.parse(stored) : [];
        return favoritesLoadedFromStorage({ favoriteUserIds });
      })
    );
  });

  saveFavoritesToStorage$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(addUserToFavorites, removeUserFromFavorites),
        tap((action) => {
          const stored = localStorage.getItem(this.STORAGE_KEY);
          let favoriteUserIds: number[] = stored ? JSON.parse(stored) : [];

          if (action.type === addUserToFavorites.type) {
            if (!favoriteUserIds.includes(action.userId)) {
              favoriteUserIds = [...favoriteUserIds, action.userId];
            }
          } else if (action.type === removeUserFromFavorites.type) {
            favoriteUserIds = favoriteUserIds.filter(id => id !== action.userId);
          }

          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favoriteUserIds));
        })
      );
    },
    { dispatch: false }
  );
}