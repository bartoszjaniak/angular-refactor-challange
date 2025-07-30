import { createSelector, createFeatureSelector } from '@ngrx/store';
import { State } from './store.reducer';

export const selectCounterState = createFeatureSelector<State>('user');



export const selectUsers = createSelector(
  selectCounterState,
  (state) => state.users
);

export const selectUserLoadParams = createSelector(
  selectCounterState,
  (state) => ({
    filter: state.filter,
    sort: state.sort,
    pagination: state.pagination,
  })
);

export const selectTotal = createSelector(
  selectCounterState,
  (state) => state.total
);

export const selectCurrentUser = createSelector(
  selectCounterState,
  (state) => state.currentUser
);

export const selectCurrentUserLoading = createSelector(
  selectCounterState,
  (state) => state.currentUserLoading
);

export const selectCurrentUserError = createSelector(
  selectCounterState,
  (state) => state.currentUserError
);
