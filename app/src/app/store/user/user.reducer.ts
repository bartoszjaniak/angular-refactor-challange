import { createReducer, on } from '@ngrx/store';
import { User } from '../../models/user.model';
import {
  loadCurrentUser,
  currentUserSuccessfullyLoaded,
  currentUserLoadFailed,
} from './user.actions';
import { userSynchronized } from '../shared/shared.actions';

export interface UserState {
  currentUser: User | null;
  currentUserLoading: boolean;
  currentUserError: any;
}

export const initialUserState: UserState = {
  currentUser: null,
  currentUserLoading: false,
  currentUserError: null,
};

export const userReducer = createReducer(
  initialUserState,
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
  })),
  on(userSynchronized, (state, { user }) => ({
    ...state,
    currentUser: state.currentUser && state.currentUser.id === user.id ? user : state.currentUser,
  }))
);