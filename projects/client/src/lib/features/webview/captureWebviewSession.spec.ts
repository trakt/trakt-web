import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { captureWebviewSession } from './captureWebviewSession.ts';
import { getSlurm } from './slurmToken.ts';
import { getStandalone } from '$lib/features/standalone/standaloneFlag.ts';

function setLocation(search: string): void {
  window.history.replaceState({}, '', `/users/me/year/2025${search}`);
}

describe('util: captureWebviewSession', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    window.history.replaceState({}, '', '/');
  });

  it('should latch the slurm token to storage', () => {
    setLocation('?slurm=secret');

    captureWebviewSession();

    expect(getSlurm()).to.equal('secret');
  });

  it('should latch the standalone flag to storage', () => {
    setLocation('?standalone_mode=1');

    captureWebviewSession();

    expect(getStandalone()).to.equal(true);
  });

  it('should strip every WebView param from the address bar', () => {
    setLocation('?slurm=secret&standalone_mode=1');

    captureWebviewSession();

    const url = new URL(window.location.href);
    expect(url.searchParams.has('slurm')).to.equal(false);
    expect(url.searchParams.has('standalone_mode')).to.equal(false);
  });

  it('should preserve non-WebView params while stripping the token', () => {
    setLocation('?slurm=secret&utm_source=app');

    captureWebviewSession();

    const url = new URL(window.location.href);
    expect(url.searchParams.has('slurm')).to.equal(false);
    expect(url.searchParams.get('utm_source')).to.equal('app');
  });

  it('should leave a param-less URL untouched', () => {
    setLocation('');

    captureWebviewSession();

    expect(getSlurm()).to.equal(null);
    expect(window.location.pathname).to.equal('/users/me/year/2025');
  });
});
