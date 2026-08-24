import { BehaviorSubject, type Observable } from 'rxjs';
import type { LoginErrorType } from '../models/LoginErrorType.ts';

const errorSubject = new BehaviorSubject<LoginErrorType | null>(null);

export const loginErrorStore: {
  error$: Observable<LoginErrorType | null>;
  set: (error: LoginErrorType) => void;
  clear: () => void;
} = {
  error$: errorSubject.asObservable(),
  set: (error: LoginErrorType) => errorSubject.next(error),
  clear: () => errorSubject.next(null),
};
