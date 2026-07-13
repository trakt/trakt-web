import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resolveSlurm } from './resolveSlurm.ts';
import { setSlurm } from './slurmToken.ts';

function setLocation(search: string): void {
  window.history.replaceState({}, '', `/users/me/year/2025${search}`);
}

describe('util: resolveSlurm', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    window.history.replaceState({}, '', '/');
  });

  it('should read the latched token from storage (client)', () => {
    setSlurm('stored');
    setLocation('');

    expect(resolveSlurm()).to.equal('stored');
  });

  it('should fall back to the URL param when storage is empty (SSR)', () => {
    setLocation('?slurm=from-url');

    expect(resolveSlurm()).to.equal('from-url');
  });

  it('should yield the same value from storage and URL', () => {
    setSlurm('tok');
    setLocation('?slurm=tok');
    const fromStorage = resolveSlurm();

    window.sessionStorage.clear();
    const fromUrl = resolveSlurm();

    expect(fromStorage).to.equal(fromUrl);
  });

  it('should normalise an empty param to undefined', () => {
    setLocation('?slurm=');

    expect(resolveSlurm()).to.equal(undefined);
  });

  it('should return undefined when no token is present', () => {
    setLocation('');

    expect(resolveSlurm()).to.equal(undefined);
  });
});
