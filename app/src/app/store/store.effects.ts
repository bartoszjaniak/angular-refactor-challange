import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import {
  map,
  catchError,
  switchMap,
  withLatestFrom,
  tap,
} from 'rxjs/operators';
import {
  loadUsers,
  setFilter,
  setPagination,
  setSort,
  usersSuccesfullyLoaded,
  loadCurrentUser,
  currentUserSuccessfullyLoaded,
  currentUserLoadFailed,
} from './store.actions';
import { UserService } from '../services/user.service';
import { Store } from '@ngrx/store';
import { selectUserLoadParams } from './store.selectors';

@Injectable({ providedIn: 'root' })
export class UsersEffects {
  private actions$ = inject(Actions);
  private userService = inject(UserService);
  private store = inject(Store);

  loadUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadUsers, setFilter, setSort, setPagination),
      withLatestFrom(this.store.select(selectUserLoadParams)),
      switchMap(([action, { filter, sort, pagination }]) =>
        this.userService
          .getUsers(filter, pagination.pageIndex + 1, pagination.pageSize, sort)
          .pipe(
            map(({ users, total }) => usersSuccesfullyLoaded({ users, total })),
            catchError(() => EMPTY)
          )
      )
    );
  });

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
}
