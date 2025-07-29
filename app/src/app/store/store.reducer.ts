import { createReducer, on } from '@ngrx/store';
import {addUserToFavorite, removeUserFromFavorite} from './store.actions'
import { User } from 'app/models/user.model';

export interface State {
  favoriteUsers: User[]
}

export const initialState: State = {
  favoriteUsers: [],
};

export const userReducer = createReducer(
  initialState,
  on(addUserToFavorite, (state, { user }) => ({
    ...state,
    favoriteUsers: [...state.favoriteUsers, user]
  })),
  on(removeUserFromFavorite, (state, { user }) => ({
    ...state,
    favoriteUsers: state.favoriteUsers.filter((u) => u.id !== user.id)
  }))
);
