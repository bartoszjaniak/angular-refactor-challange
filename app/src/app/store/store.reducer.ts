import { createReducer, on } from '@ngrx/store';
import {
  addUserToFavorite,
  removeUserFromFavorite,
  setFilter,
  setPagination,
  setSort,
  usersSuccesfullyLoaded,
  userSynchronize,
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
  total: number;
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
  total: 0,
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
  on(usersSuccesfullyLoaded, (state, { users, total }) => ({
    ...state,
    users,
    total,
  })),
  on(userSynchronize, (state, { user }) => ({
    ...state,
    users: state.users.map(u => u.id === user.id ? user : u),
  }))
);
