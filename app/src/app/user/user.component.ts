import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { User } from '../models/user.model';
import { WebsocketService } from '../services/websocket.service';
import { loadCurrentUser } from '../store/store.actions';
import {
  selectCurrentUser,
  selectCurrentUserLoading,
  selectCurrentUserError,
} from '../store/store.selectors';
import {
  addUserToFavorites,
  removeUserFromFavorites,
  loadFavoritesFromStorage,
} from '../store/favorites/favorites.actions';
import {
  selectIsUserFavorite,
} from '../store/favorites/favorites.selectors';
import { map, takeUntil, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.component.scss'],
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit, OnDestroy {
  private webSocketService = inject(WebsocketService);
  private route = inject(ActivatedRoute);
  private store = inject(Store);

  private destroyed$ = new Subject<void>();

  currentUser$ = this.store.select(selectCurrentUser);
  currentUserLoading$ = this.store.select(selectCurrentUserLoading);
  currentUserError$ = this.store.select(selectCurrentUserError);

  isCurrentUserFavorite$ = this.currentUser$.pipe(
    switchMap((user) => 
      user ? this.store.select(selectIsUserFavorite(user.id)) : [false]
    )
  );

  ngOnInit() {
    // Ładujemy ulubione z localStorage przy inicjalizacji
    this.store.dispatch(loadFavoritesFromStorage());
    
    this.route.params.pipe(
      map((params) => params['id'] as string),
      takeUntil(this.destroyed$)
    ).subscribe((userId) => {
      this.store.dispatch(loadCurrentUser({ userId }));
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  synchronizeUser(user: User) {
    console.log('starting synchronization');
    const message = JSON.stringify({
      type: 'SynchronizeUser',
      payload: user.id,
    });
    this.webSocketService.sendMessage(message);
  }

  removeFromFavorites(user: User) {
    this.store.dispatch(removeUserFromFavorites({ userId: user.id }));
  }

  addToFavorites(user: User) {
    this.store.dispatch(addUserToFavorites({ userId: user.id }));
  }
}
