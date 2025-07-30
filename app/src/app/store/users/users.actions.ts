import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';

export const loadUsers = createAction('[Users] Load Users');

export const setSort = createAction('[Users] Set Sort', props<{ sort: string }>());
export const setFilter = createAction('[Users] Set Filter', props<{ filter: string }>());
export const setPagination = createAction('[Users] Set Pagination', props<{ pageIndex: number, pageSize: number }>());

export const usersSuccessfullyLoaded = createAction('[Users] Users Successfully Loaded', props<{ users: User[], total: number }>());