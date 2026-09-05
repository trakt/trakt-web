import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import IndicatorTag from './IndicatorTag.svelte';

describe('IndicatorTag', () => {
  describe('watched', () => {
    it('should stay a plain badge for a single play', () => {
      const { container } = render(IndicatorTag, {
        props: { indicator: 'watched', count: 1 },
      });

      expect(container.textContent?.trim()).toBe('');
      expect(container.querySelector('.has-count')).toBeNull();
    });

    it('should stay a plain badge when the count is unknown', () => {
      const { container } = render(IndicatorTag, {
        props: { indicator: 'watched' },
      });

      expect(container.textContent?.trim()).toBe('');
      expect(container.querySelector('.has-count')).toBeNull();
    });

    it('should show how many plays once a title was rewatched', () => {
      const { container } = render(IndicatorTag, {
        props: { indicator: 'watched', count: 3 },
      });

      expect(container.textContent).toContain('3');
      expect(container.querySelector('.has-count')).not.toBeNull();
    });
  });

  it('should never count a badge that is not about being watched', () => {
    const { container } = render(IndicatorTag, {
      props: { indicator: 'dropped', count: 4 },
    });

    expect(container.textContent?.trim()).toBe('');
    expect(container.querySelector('.has-count')).toBeNull();
  });
});
