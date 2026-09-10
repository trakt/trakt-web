import { onlineManager } from '@tanstack/query-core';
import { Observable, type Observer } from 'rxjs';

const isOnline$ = new Observable<boolean>((subscriber: Observer<boolean>) => {
  subscriber.next(onlineManager.isOnline());

  return onlineManager.subscribe((isOnline) => subscriber.next(isOnline));
});

export const onlineStatusStore: {
  isOnline$: Observable<boolean>;
  isOnline: () => boolean;
} = {
  isOnline$,
  isOnline: () => onlineManager.isOnline(),
};
