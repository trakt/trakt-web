import GlobalParameterHost from '$test/beds/parameters/GlobalParameterHost.svelte';
import { render } from '@testing-library/svelte';
import { beforeEach, describe, expect, it } from 'vitest';

describe('GlobalParameterProvider', () => {
  beforeEach(() => {
    globalThis.window.history.pushState(
      {},
      '',
      '/profile/userA?mode=movie&sort_by=rank&sort_how=asc',
    );
  });

  it('should append its context parameters to anchors rendered under it', () => {
    const { getByTestId } = render(GlobalParameterHost, {
      props: { href: '?mode=movie', parameter: 'mode' },
    });

    const params = new URL(
      (getByTestId('link') as HTMLAnchorElement).href,
    ).searchParams;

    expect(params.get('mode')).toBe('movie');
    expect(params.get('sort_by')).toBe('rank');
    expect(params.get('sort_how')).toBe('asc');
  });
});
