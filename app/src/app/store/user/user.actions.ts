import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';

export const loadCurrentUser = createAction('[User] Load Current User', props<{ userId: string }>());
export const currentUserSuccessfullyLoaded = createAction('[User] Current User Successfully Loaded', props<{ user: User }>());
export const currentUserLoadFailed = createAction('[User] Current User Load Failed', props<{ error: any }>());

export const synchronizeUser = createAction('[User] Synchronize User', props<{ user: User }>());