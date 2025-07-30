import {createAction, props} from '@ngrx/store'
import { User } from 'app/models/user.model';

export const loadUsers = createAction('[User] Load Users');

export const setSort = createAction('[User] Set Sort', props<{ sort: string }>());
export const setFilter = createAction('[User] Set Filter', props<{ filter: string }>());
export const setPagination = createAction('[User] Set Pagination', props<{ pageIndex: number, pageSize: number }>());

export const usersSuccesfullyLoaded = createAction('[User] Users Successfully Loaded', props<{ users: User[], total: number }>());



export const userSynchronize = createAction('[User] User Synchronize', props<{ user: User }>());

export const loadCurrentUser = createAction('[User] Load Current User', props<{ userId: string }>());
export const currentUserSuccessfullyLoaded = createAction('[User] Current User Successfully Loaded', props<{ user: User }>());
export const currentUserLoadFailed = createAction('[User] Current User Load Failed', props<{ error: any }>());
