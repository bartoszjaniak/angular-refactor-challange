import { createReducer, on } from '@ngrx/store';
import {
  addUserToFavorite,
  removeUserFromFavorite,
  setFilter,
  setPagination,
  setSort,
  usersSuccesfullyLoaded,
} from './store.actions';
import { User } from 'app/models/user.model';

export interface State {
  users: User[];
  favoriteUsers: User[];
  filter: string;
  sort: string;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
}

export const initialState: State = {
  users: [],
  favoriteUsers: [],
  filter: '',
  sort: '',
  pagination: {
    pageIndex: 0,
    pageSize: 10,
  },
};

export const userReducer = createReducer(
  initialState,
  on(setFilter, (state, { filter }) => ({
    ...state,
    filter,
  })),
  on(setSort, (state, { sort }) => ({
    ...state,
    sort,
  })),
  on(setPagination, (state, { pageIndex, pageSize }) => ({
    ...state,
    pagination: {
      pageIndex,
      pageSize,
    },
  })),
  on(addUserToFavorite, (state, { user }) => ({
    ...state,
    favoriteUsers: [...state.favoriteUsers, user],
  })),
  on(removeUserFromFavorite, (state, { user }) => ({
    ...state,
    favoriteUsers: state.favoriteUsers.filter((u) => u.id !== user.id),
  })),
  on(usersSuccesfullyLoaded, (state, { users }) => ({
    ...state,
    users,
  }))
);
