import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { WebsocketService } from '../services/websocket.service';
import {
  removeUserFromFavorite,
  addUserToFavorite,
} from '../store/store.actions';
import {
  selectFavoriteUsers,
} from '../store/store.selectors';
import { map, takeUntil, switchMap, Subject } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.component.scss'],
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements  OnDestroy {
  private webSocketService = inject(WebsocketService);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private store = inject(Store);

  private destroyed$ = new Subject<void>();

  favoriteUsers$ = this.store.select(selectFavoriteUsers);

  currentUser$ = this.route.params.pipe(    
    map((params) => params['id'] as string),
    switchMap((userId) => this.userService.getUser(userId)),
    takeUntil(this.destroyed$)
  );

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
