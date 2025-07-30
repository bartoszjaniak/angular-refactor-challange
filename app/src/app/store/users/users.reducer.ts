import { createReducer, on } from '@ngrx/store';
import { User } from '../../models/user.model';
import {
  setFilter,
  setPagination,
  setSort,
  usersSuccessfullyLoaded,
} from './users.actions';
import { userSynchronized } from '../shared/shared.actions';

export interface UsersState {
  users: User[];
  filter: string;
  sort: string;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  total: number;
}

export const initialUsersState: UsersState = {
  users: [],
  filter: '',
  sort: '',
  pagination: {
    pageIndex: 0,
    pageSize: 10,
  },
  total: 0,
};

export const usersReducer = createReducer(
  initialUsersState,
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
  on(usersSuccessfullyLoaded, (state, { users, total }) => ({
    ...state,
    users,
    total,
  })),
  on(userSynchronized, (state, { user }) => ({
    ...state,
    users: state.users.map(u => u.id === user.id ? user : u),
  }))
);