import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';

export const userSynchronized = createAction(
  '[Shared] User Synchronized',
  props<{ user: User }>()
);