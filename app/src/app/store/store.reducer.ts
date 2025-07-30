import { createReducer, on } from '@ngrx/store';
import {
  setFilter,
  setPagination,
  setSort,
  usersSuccesfullyLoaded,
  userSynchronize,
  loadCurrentUser,
  currentUserSuccessfullyLoaded,
  currentUserLoadFailed,
} from './store.actions';
import { User } from 'app/models/user.model';

export interface State {
  users: User[];
  currentUser: User | null;
  currentUserLoading: boolean;
  currentUserError: any;
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
  currentUser: null,
  currentUserLoading: false,
  currentUserError: null,
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

  on(usersSuccesfullyLoaded, (state, { users, total }) => ({
    ...state,
    users,
    total,
  })),
  on(userSynchronize, (state, { user }) => ({
    ...state,
    users: state.users.map(u => u.id === user.id ? user : u),
    currentUser: state.currentUser && state.currentUser.id === user.id ? user : state.currentUser,
  })),
  on(loadCurrentUser, (state) => ({
    ...state,
    currentUserLoading: true,
    currentUserError: null,
  })),
  on(currentUserSuccessfullyLoaded, (state, { user }) => ({
    ...state,
    currentUser: user,
    currentUserLoading: false,
    currentUserError: null,
  })),
  on(currentUserLoadFailed, (state, { error }) => ({
    ...state,
    currentUser: null,
    currentUserLoading: false,
    currentUserError: error,
  }))
);
