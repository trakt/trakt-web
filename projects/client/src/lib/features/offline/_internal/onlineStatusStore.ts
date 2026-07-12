import { browser } from '$app/environment';
import { BehaviorSubject, type Observable } from 'rxjs';

const isOnlineSubject = new BehaviorSubject<boolean>(
  browser ? navigator.onLine : true,
);

if (browser) {
  globalThis.addEventListener('online', () => isOnlineSubject.next(true));
  globalThis.addEventListener('offline', () => isOnlineSubject.next(false));
}

export const onlineStatusStore: {
  isOnline$: Observable<boolean>;
  isOnline: () => boolean;
} = {
  isOnline$: isOnlineSubject.asObservable(),
  isOnline: () => isOnlineSubject.getValue(),
};
