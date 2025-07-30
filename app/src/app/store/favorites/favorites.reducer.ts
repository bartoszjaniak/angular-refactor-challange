import { createReducer, on } from '@ngrx/store';
import {
  addUserToFavorites,
  removeUserFromFavorites,
  favoritesLoadedFromStorage,
} from './favorites.actions';

export interface FavoritesState {
  favoriteUserIds: Set<number>;
}

export const initialFavoritesState: FavoritesState = {
  favoriteUserIds: new Set<number>(),
};

export const favoritesReducer = createReducer(
  initialFavoritesState,
  on(favoritesLoadedFromStorage, (state, { favoriteUserIds }) => ({
    ...state,
    favoriteUserIds: new Set(favoriteUserIds),
  })),
  on(addUserToFavorites, (state, { userId }) => ({
    ...state,
    favoriteUserIds: new Set([...state.favoriteUserIds, userId]),
  })),
  on(removeUserFromFavorites, (state, { userId }) => {
    const newSet = new Set(state.favoriteUserIds);
    newSet.delete(userId);
    return {
      ...state,
      favoriteUserIds: newSet,
    };
  })
);