import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
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
import { Subscription, takeUntil } from 'rxjs';
import { I18NextModule, I18NEXT_SERVICE } from 'angular-i18next';
import { TranslationService } from './config/i18n.config';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, I18NextModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app';
  private wsSub!: Subscription;

  private snackBar = inject(MatSnackBar);
  private i18NextService = inject(I18NEXT_SERVICE);
  private cdr = inject(ChangeDetectorRef);

  constructor(
    private websocketService: WebsocketService,
    private messageHandler: WebsocketMessageHandlerService,
    private store: Store,
    private translationService: TranslationService,
  ) { }

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

  async switchLanguage(language: string) {
    try {
      await this.translationService.changeLanguage(language);
      window.location.reload();
      // Nie potrzeba już przeładowania strony - język zmieni się dynamicznie
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  
  }

  private registerMessageHandlers() {
    this.messageHandler.registerHandler('ReceiveMessage', (payload: any) => {
      const timeFromUTC = new Date(payload).toLocaleTimeString();
      const message = this.i18NextService.t('notification.message', { message: timeFromUTC });
      const closeText = this.i18NextService.t('notification.ok');
      this.snackBar.open(message, closeText, {
        duration: 3000,
        horizontalPosition: 'right',
      });
    });

    this.messageHandler.registerHandler(
      'SynchronizeUserFinished',
      (payload: User) => {
        const message = this.i18NextService.t('notification.synchronized');
        const closeText = this.i18NextService.t('notification.ok');
        this.snackBar.open(message, closeText, {
          duration: 3000,
          horizontalPosition: 'right',
        });
        this.store.dispatch(synchronizeUser({ user: payload }));
      }
    );
  }
}
