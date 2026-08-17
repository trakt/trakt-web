import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import type { ShareType } from '../models/ShareType.ts';
import Poster from './Poster.svelte';

const POSTER_URL = 'data:image/jpeg;base64,abc';
const POSTER_ASPECT_RATIO = 232 / 350;

const PX_VALUE = /^\d+(\.\d+)?px$/;

function renderPoster(variant: ShareType) {
  render(Poster, { props: { posterUrl: POSTER_URL, variant } });

  return screen.getByAltText('poster');
}

describe('component: share Poster', () => {
  const variants: ReadonlyArray<ShareType> = ['open-graph', 'feed', 'story'];

  for (const variant of variants) {
    describe(`variant: ${variant}`, () => {
      it('should size the poster via CSS, which satori parses', () => {
        const poster = renderPoster(variant);

        expect(poster.style.width).toMatch(PX_VALUE);
        expect(poster.style.height).toMatch(PX_VALUE);
      });

      it('should not size the poster via width/height attributes, which satori discards', () => {
        const poster = renderPoster(variant);

        expect(poster.getAttribute('width')).toBeNull();
        expect(poster.getAttribute('height')).toBeNull();
      });

      it('should keep the poster aspect ratio', () => {
        const poster = renderPoster(variant);

        const width = Number.parseFloat(poster.style.width);
        const height = Number.parseFloat(poster.style.height);

        expect(width / height).toBeCloseTo(POSTER_ASPECT_RATIO);
      });
    });
  }
});
