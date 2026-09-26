import { FeatureFlag } from '$lib/features/feature-flag/models/FeatureFlag.ts';
import { server } from '$mocks/server.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen, waitFor } from '@testing-library/svelte';
import { http, HttpResponse } from 'msw';
import { BehaviorSubject } from 'rxjs';
import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import FeaturedPeopleList from './FeaturedPeopleList.svelte';

const viewer = new BehaviorSubject({ isVip: true, isDirector: false });
const authorized = new BehaviorSubject(true);

vi.mock('$lib/features/auth/stores/useUser.ts', () => ({
  useUser: () => ({ user: viewer }),
}));
vi.mock('$lib/features/auth/stores/useAuth.ts', () => ({
  useAuth: () => ({ isAuthorized: authorized }),
}));

const requestFeatured = vi.fn(() =>
  HttpResponse.json({
    featured: [{
      name: 'Rebecca Ferguson',
      ids: { trakt: 2, slug: 'rebecca-ferguson' },
    }],
  })
);

function renderFeatured(enabled: boolean) {
  localStorage.setItem(
    'trakt-feature-flags',
    JSON.stringify({ [FeatureFlag.FeaturedPeople]: enabled }),
  );
  return renderComponent(FeaturedPeopleList, { props: { listId: 42 } });
}

describe('FeaturedPeopleList', () => {
  beforeEach(() => {
    viewer.next({ isVip: true, isDirector: false });
    authorized.next(true);
    server.use(http.get('http://localhost/lists/:id', requestFeatured));
  });

  afterEach(() => localStorage.clear());

  it.each([
    { enabled: false, isVip: true, isAuthorized: true },
    { enabled: true, isVip: false, isAuthorized: true },
    { enabled: true, isVip: true, isAuthorized: false },
  ])('should neither render nor fetch when access is unavailable: %o', async ({
    enabled,
    isVip,
    isAuthorized,
  }) => {
    viewer.next({ isVip, isDirector: false });
    authorized.next(isAuthorized);
    renderFeatured(enabled);
    await tick();

    expect(screen.queryByText('Featured People')).not.toBeInTheDocument();
    expect(requestFeatured).not.toHaveBeenCalled();
  });

  it('should fetch for an opted-in VIP and hide cached content on logout', async () => {
    renderFeatured(true);
    expect(await screen.findByText('Featured People')).toBeInTheDocument();
    expect(requestFeatured).toHaveBeenCalledOnce();

    authorized.next(false);
    await waitFor(() =>
      expect(screen.queryByText('Featured People')).not.toBeInTheDocument()
    );
  });

  it('should hide cached content when VIP access is revoked and restore it on upgrade', async () => {
    viewer.next({ isVip: false, isDirector: false });
    renderFeatured(true);
    await tick();
    expect(requestFeatured).not.toHaveBeenCalled();

    viewer.next({ isVip: true, isDirector: false });
    expect(await screen.findByText('Featured People')).toBeInTheDocument();
    expect(requestFeatured).toHaveBeenCalledOnce();

    viewer.next({ isVip: false, isDirector: false });
    await waitFor(() =>
      expect(screen.queryByText('Featured People')).not.toBeInTheDocument()
    );
    viewer.next({ isVip: true, isDirector: false });
    expect(await screen.findByText('Featured People')).toBeInTheDocument();
    expect(requestFeatured).toHaveBeenCalledOnce();
  });

  it('should hide the section when the list has no featured people', async () => {
    requestFeatured.mockReturnValueOnce(HttpResponse.json({ featured: [] }));
    renderFeatured(true);
    await waitFor(() => expect(requestFeatured).toHaveBeenCalledOnce());
    await tick();
    expect(screen.queryByText('Featured People')).not.toBeInTheDocument();
  });
});
