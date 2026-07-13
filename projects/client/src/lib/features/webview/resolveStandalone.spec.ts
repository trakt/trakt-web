import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resolveStandalone } from './resolveStandalone.ts';

function setLocation(search: string): void {
  window.history.replaceState({}, '', `/users/me/year/2025${search}`);
}

describe('util: resolveStandalone', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    window.history.replaceState({}, '', '/');
  });

  it('should accept the `1` spelling', () => {
    setLocation('?standalone_mode=1');

    expect(resolveStandalone()).to.equal(true);
  });

  it('should accept the `true` spelling', () => {
    setLocation('?standalone_mode=true');

    expect(resolveStandalone()).to.equal(true);
  });

  it('should be false for any other value', () => {
    setLocation('?standalone_mode=0');

    expect(resolveStandalone()).to.equal(false);
  });

  it('should be false when absent', () => {
    setLocation('');

    expect(resolveStandalone()).to.equal(false);
  });
});
