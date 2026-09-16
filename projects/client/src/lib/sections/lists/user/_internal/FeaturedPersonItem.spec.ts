import { mapToPersonSummary } from '$lib/requests/_internal/mapToPersonSummary.ts';
import { server } from '$mocks/server.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen } from '@testing-library/svelte';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import FeaturedPersonItem from './FeaturedPersonItem.svelte';

describe('FeaturedPersonItem', () => {
  it.each(['card', 'summary'] as const)(
    'should render the supplied headshot without fetching a profile (%s)',
    async (variant) => {
      const requestPerson = vi.fn(() => HttpResponse.json({}));
      server.use(http.get('http://localhost/people/:slug', requestPerson));
      renderComponent(FeaturedPersonItem, {
        props: {
          variant,
          person: mapToPersonSummary({
            name: 'Rebecca Ferguson',
            ids: { trakt: 2, slug: 'rebecca-ferguson' },
            images: {
              headshot: [
                'https://walter.trakt.tv/images/people/2/headshots/medium/rebecca.webp',
              ],
              fanart: [],
            },
          }),
        },
      });

      expect(await screen.findByRole('img', { name: /Rebecca Ferguson/ }))
        .toHaveAttribute(
          'src',
          'https://walter.trakt.tv/images/people/2/headshots/thumb/rebecca.webp',
        );
      expect(screen.getByText('Rebecca Ferguson')).toBeInTheDocument();
      expect(requestPerson).not.toHaveBeenCalled();
    },
  );
});
