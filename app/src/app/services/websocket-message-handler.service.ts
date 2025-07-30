import { Injectable } from '@angular/core';

export interface WebSocketMessage {
  type: string;
  payload: any;
}

export type MessageHandler = (payload: any) => void;

@Injectable({
  providedIn: 'root'
})
export class WebsocketMessageHandlerService {
  private handlers = new Map<string, MessageHandler>();

  constructor() {}

  registerHandler(messageType: string, handler: MessageHandler): void {
    this.handlers.set(messageType, handler);
  }

  unregisterHandler(messageType: string): void {
    this.handlers.delete(messageType);
  }

  handleMessage(message: WebSocketMessage): void {
    const handler = this.handlers.get(message.type);
    if (handler) {
      handler(message.payload);
    } else {
      console.warn(`No handler registered for message type: ${message.type}`);
    }
  }
}