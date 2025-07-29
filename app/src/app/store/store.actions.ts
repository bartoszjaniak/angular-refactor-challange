import {createAction, props} from '@ngrx/store'
import { User } from 'app/models/user.model';

export const loadUsers = createAction('[User] Load Users');

export const setSort = createAction('[User] Set Sort', props<{ sort: string }>());
export const setFilter = createAction('[User] Set Filter', props<{ filter: string }>());
export const setPagination = createAction('[User] Set Pagination', props<{ pageIndex: number, pageSize: number }>());

export const usersSuccesfullyLoaded = createAction('[User] Users Successfully Loaded', props<{ users: User[] }>());

export const addUserToFavorite = createAction('[User] Add user to favorite', props<{ user: User }>());
export const removeUserFromFavorite = createAction('[User] Remove user from favorite', props<{ user: User }>());
