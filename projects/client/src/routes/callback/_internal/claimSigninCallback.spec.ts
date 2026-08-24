import { beforeEach, describe, expect, it, vi } from 'vitest';

async function importClaim() {
  const module = await import('./claimSigninCallback.ts');
  return module.claimSigninCallback;
}

describe('claimSigninCallback', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('should grant the first claim', async () => {
    const claimSigninCallback = await importClaim();

    expect(claimSigninCallback()).toBe(true);
  });

  it('should refuse a second claim', async () => {
    const claimSigninCallback = await importClaim();

    expect(claimSigninCallback()).toBe(true);
    expect(claimSigninCallback()).toBe(false);
  });

  it('should refuse every claim after the first', async () => {
    const claimSigninCallback = await importClaim();

    claimSigninCallback();

    expect([claimSigninCallback(), claimSigninCallback()]).toEqual([
      false,
      false,
    ]);
  });
});
