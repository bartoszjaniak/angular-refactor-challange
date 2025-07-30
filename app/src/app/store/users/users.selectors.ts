import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UsersState } from './users.reducer';

export const selectUsersState = createFeatureSelector<UsersState>('users');

export const selectUsers = createSelector(
  selectUsersState,
  (state) => state.users
);

export const selectUserLoadParams = createSelector(
  selectUsersState,
  (state) => ({
    filter: state.filter,
    sort: state.sort,
    pagination: state.pagination,
  })
);

export const selectTotal = createSelector(
  selectUsersState,
  (state) => state.total
);