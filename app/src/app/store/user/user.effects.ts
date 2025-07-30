import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  map,
  catchError,
  switchMap,
} from 'rxjs/operators';
import {
  loadCurrentUser,
  currentUserSuccessfullyLoaded,
  currentUserLoadFailed,
  synchronizeUser,
} from './user.actions';
import { userSynchronized } from '../shared/shared.actions';
import { UserService } from '../../services/user.service';

@Injectable({ providedIn: 'root' })
export class UserEffects {
  private actions$ = inject(Actions);
  private userService = inject(UserService);

  loadCurrentUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadCurrentUser),
      switchMap(({ userId }) =>
        this.userService.getUser(userId).pipe(
          map((user) => currentUserSuccessfullyLoaded({ user })),
          catchError((error) => [currentUserLoadFailed({ error })])
        )
      )
    );
  });

  synchronizeUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(synchronizeUser),
      map(({ user }) => userSynchronized({ user }))
    );
  });
}