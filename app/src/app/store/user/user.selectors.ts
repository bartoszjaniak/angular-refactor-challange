import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UserState } from './user.reducer';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectCurrentUser = createSelector(
  selectUserState,
  (state) => state.currentUser
);

export const selectCurrentUserLoading = createSelector(
  selectUserState,
  (state) => state.currentUserLoading
);

export const selectCurrentUserError = createSelector(
  selectUserState,
  (state) => state.currentUserError
);