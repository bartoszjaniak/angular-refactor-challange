import {createAction, props} from '@ngrx/store'
import { User } from 'app/models/user.model';

export const addUserToFavorite = createAction('[User] Add user to favorite', props<{ user: User }>());
export const removeUserFromFavorite = createAction('[User] Remove user from favorite', props<{ user: User }>());
