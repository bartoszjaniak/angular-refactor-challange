import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WebsocketService } from './services/websocket.service';
import {
  WebsocketMessageHandlerService,
  WebSocketMessage,
} from './services/websocket-message-handler.service';
import { Store } from '@ngrx/store';
import { synchronizeUser } from './store/user/user.actions';
import { loadFavoritesFromStorage } from './store/favorites/favorites.actions';
import { User } from './models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app';
  private wsSub!: Subscription;

  constructor(
    private websocketService: WebsocketService,
    private messageHandler: WebsocketMessageHandlerService,
    private store: Store
  ) {}

  ngOnInit() {
    // Ładujemy ulubione z localStorage przy starcie aplikacji
    this.store.dispatch(loadFavoritesFromStorage());
    
    this.registerMessageHandlers();

    this.wsSub = this.websocketService
      .connect('ws://localhost:9334/notificationHub')
      .subscribe((msg) => {
        try {
          const parsedMessage = JSON.parse(msg) as WebSocketMessage;
          this.messageHandler.handleMessage(parsedMessage);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      });
  }

  ngOnDestroy() {
    if (this.wsSub) {
      this.wsSub.unsubscribe();
    }
  }

  private registerMessageHandlers() {
    this.messageHandler.registerHandler('ReceiveMessage', (payload: any) => {
      console.log('Toast notification:', payload);
    });

    this.messageHandler.registerHandler(
      'SynchronizeUserFinished',
      (payload: User) => {
        console.log('User synchronized:', payload);
        this.store.dispatch(synchronizeUser({ user: payload }));
      }
    );
  }
}
