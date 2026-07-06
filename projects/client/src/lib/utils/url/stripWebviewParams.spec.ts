import { describe, expect, it } from 'vitest';
import { stripWebviewParams } from './stripWebviewParams.ts';

describe('util: stripWebviewParams', () => {
  it('should remove the slurm token', () => {
    const result = stripWebviewParams(
      new URL('https://trakt.tv/users/me/year/2025?slurm=secret'),
    );

    expect(result.searchParams.has('slurm')).to.equal(false);
  });

  it('should remove the standalone_mode flag', () => {
    const result = stripWebviewParams(
      new URL('https://trakt.tv/users/me/year/2025?standalone_mode=1'),
    );

    expect(result.searchParams.has('standalone_mode')).to.equal(false);
  });

  it('should strip every WebView param at once', () => {
    const result = stripWebviewParams(
      new URL(
        'https://trakt.tv/users/me/year/2025?slurm=secret&standalone_mode=1',
      ),
    );

    expect(result.search).to.equal('');
  });

  it('should preserve non-WebView params', () => {
    const result = stripWebviewParams(
      new URL(
        'https://trakt.tv/users/me/year/2025?slurm=secret&utm_source=app',
      ),
    );

    expect(result.searchParams.get('utm_source')).to.equal('app');
    expect(result.searchParams.has('slurm')).to.equal(false);
  });

  it('should not mutate the input url', () => {
    const input = new URL('https://trakt.tv/users/me/year/2025?slurm=secret');
    stripWebviewParams(input);

    expect(input.searchParams.get('slurm')).to.equal('secret');
  });
});
