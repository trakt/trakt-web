import { BehaviorSubject } from 'rxjs';

export class WritableSubject<T> extends BehaviorSubject<T> {
  public set(value: T): void {
    this.next(value);
  }

  public update(updater: (value: T) => T): void {
    this.next(updater(this.getValue()));
  }
}

export function writable<T>(initialValue: T): WritableSubject<T> {
  return new WritableSubject<T>(initialValue);
}
