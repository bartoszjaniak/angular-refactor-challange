import { createAction, props } from '@ngrx/store';

export const loadFavoritesFromStorage = createAction('[Favorites] Load Favorites From Storage');

export const addUserToFavorites = createAction(
  '[Favorites] Add User To Favorites',
  props<{ userId: number }>()
);

export const removeUserFromFavorites = createAction(
  '[Favorites] Remove User From Favorites',
  props<{ userId: number }>()
);

export const favoritesLoadedFromStorage = createAction(
  '[Favorites] Favorites Loaded From Storage',
  props<{ favoriteUserIds: number[] }>()
);