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
import {
  removeUserFromFavorite,
  addUserToFavorite,
  loadCurrentUser,
} from '../store/store.actions';
import {
  selectFavoriteUsers,
  selectCurrentUser,
  selectCurrentUserLoading,
  selectCurrentUserError,
} from '../store/store.selectors';
import { map, takeUntil, Subject } from 'rxjs';

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

  favoriteUsers$ = this.store.select(selectFavoriteUsers);
  currentUser$ = this.store.select(selectCurrentUser);
  currentUserLoading$ = this.store.select(selectCurrentUserLoading);
  currentUserError$ = this.store.select(selectCurrentUserError);

  ngOnInit() {
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
    this.store.dispatch(removeUserFromFavorite({ user: user }));
  }

  addToFavorites(user: User) {
    this.store.dispatch(addUserToFavorite({ user: user }));
  }
}
