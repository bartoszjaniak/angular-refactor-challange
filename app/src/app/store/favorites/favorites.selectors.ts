import { createSelector, createFeatureSelector } from '@ngrx/store';
import { FavoritesState } from './favorites.reducer';

export const selectFavoritesState = createFeatureSelector<FavoritesState>('favorites');

export const selectFavoriteUserIds = createSelector(
  selectFavoritesState,
  (state) => state.favoriteUserIds
);

export const selectIsUserFavorite = (userId: number) => createSelector(
  selectFavoriteUserIds,
  (favoriteUserIds) => favoriteUserIds.has(userId)
);