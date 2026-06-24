import { afterEach, describe, expect, it } from 'vitest';
import {
  acquireFilterScope,
  filterScopeStore,
  releaseFilterScope,
} from './filterScopeStore.ts';

function currentValue() {
  let value;
  const sub = filterScopeStore.subscribe((v) => (value = v));
  sub.unsubscribe();
  return value;
}

describe('store: filterScopeStore', () => {
  const acquired: symbol[] = [];

  // Wraps acquire so afterEach can drain the module-level scope stack,
  // keeping tests isolated even when they leave a scope dangling on purpose.
  function acquire(value: Parameters<typeof acquireFilterScope>[0]) {
    const token = acquireFilterScope(value);
    acquired.push(token);
    return token;
  }

  afterEach(() => {
    acquired.splice(0).forEach(releaseFilterScope);
  });

  it('should push the acquired value to the store', () => {
    acquire({ genres: 'action' });
    expect(currentValue()).toEqual({ genres: 'action' });
  });

  it('should accept null for global scope', () => {
    acquire({ genres: 'action' });
    acquire(null);
    expect(currentValue()).toBeNull();
  });

  it('should reset to null when the owning token releases', () => {
    const token = acquire({ genres: 'action' });
    releaseFilterScope(token);
    expect(currentValue()).toBeNull();
  });

  it('should ignore a release from a stale (non-owning) token', () => {
    const stale = acquire({ genres: 'action' });
    acquire({ genres: 'comedy' });

    releaseFilterScope(stale);

    // The newest owner still holds the store - a destroyed predecessor
    // must not wipe the active scope.
    expect(currentValue()).toEqual({ genres: 'comedy' });
  });

  it('should restore the previous scope when the active nested scope is released', () => {
    const outer = acquire({ genres: 'action' });
    const inner = acquire({ genres: 'comedy' });

    expect(currentValue()).toEqual({ genres: 'comedy' });

    releaseFilterScope(inner);
    expect(currentValue()).toEqual({ genres: 'action' });

    releaseFilterScope(outer);
    expect(currentValue()).toBeNull();
  });
});
