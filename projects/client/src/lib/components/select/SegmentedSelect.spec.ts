import SegmentedSelect from './SegmentedSelect.svelte';

import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it, vi } from 'vitest';
import type { SegmentedSelectOption } from './models/SegmentedSelectOption.ts';

describe('component: SegmentedSelect', () => {
  const options: SegmentedSelectOption[] = [
    { value: 'media', label: 'Media' },
    { value: 'show', label: 'Shows' },
    { value: 'movie', label: 'Movies' },
  ];

  const baseProps = {
    options,
    ariaLabel: 'Media type',
    onChange: () => {},
  };

  it('should render every option as a radio', () => {
    render(SegmentedSelect, { ...baseProps, value: 'media' });

    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('should mark only the selected option as checked', () => {
    render(SegmentedSelect, { ...baseProps, value: 'show' });

    expect(screen.getByRole('radio', { name: 'Shows' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByRole('radio', { name: 'Media' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
  });

  it('should emit the option value when an option is activated', async () => {
    const onChange = vi.fn();
    render(SegmentedSelect, { ...baseProps, value: 'media', onChange });

    await fireEvent.click(screen.getByRole('radio', { name: 'Movies' }));

    expect(onChange).toHaveBeenCalledWith('movie');
  });

  it('should expose the variant via a data attribute', () => {
    const { container } = render(SegmentedSelect, {
      ...baseProps,
      value: 'media',
      variant: 'compact',
    });

    expect(container.querySelector('.trakt-segmented-select')).toHaveAttribute(
      'data-variant',
      'compact',
    );
  });

  it('should not expose expandable state on the default (non-expandable) path', () => {
    const { container } = render(SegmentedSelect, {
      ...baseProps,
      value: 'media',
    });

    expect(
      container.querySelector('.trakt-segmented-select'),
    ).not.toHaveAttribute('data-expandable');
  });

  describe('expandable', () => {
    const searchOptions: SegmentedSelectOption[] = [
      { value: 'media', label: 'Media' },
      { value: 'show', label: 'Shows' },
      { value: 'movie', label: 'Movies' },
      { value: 'people', label: 'People' },
      { value: 'lists', label: 'Lists' },
    ];

    const expandableProps = {
      options: searchOptions,
      ariaLabel: 'Content type',
      expandable: true,
      collapsedCount: 2,
      onChange: () => {},
    };

    it('should keep collapsed trailing options out of the radio group until expanded', () => {
      render(SegmentedSelect, {
        ...expandableProps,
        value: 'media',
        expanded: false,
      });

      // Leading options are live radios; the collapsed pair is hidden (disabled
      // + aria-hidden) so it is neither a radio nor keyboard/dpad reachable.
      expect(screen.getAllByRole('radio')).toHaveLength(3);
      expect(screen.queryByRole('radio', { name: 'People' })).toBeNull();
      expect(screen.queryByRole('radio', { name: 'Lists' })).toBeNull();
    });

    it('should reveal the trailing options when expanded', () => {
      render(SegmentedSelect, {
        ...expandableProps,
        value: 'media',
        expanded: true,
      });

      expect(screen.getAllByRole('radio')).toHaveLength(5);
      expect(screen.getByRole('radio', { name: 'People' })).toBeInTheDocument();
    });

    it('should mark the track as expandable', () => {
      const { container } = render(SegmentedSelect, {
        ...expandableProps,
        value: 'media',
      });

      expect(
        container.querySelector('.trakt-segmented-select'),
      ).toHaveAttribute('data-expandable', 'true');
    });

    it('should only render the extension row while expanded', () => {
      const extension = createRawSnippet(() => ({
        render: () => '<span>Embedded search</span>',
      }));

      const collapsed = render(SegmentedSelect, {
        ...expandableProps,
        value: 'media',
        expanded: false,
        extension,
      });
      expect(collapsed.queryByText('Embedded search')).toBeNull();
      collapsed.unmount();

      const expanded = render(SegmentedSelect, {
        ...expandableProps,
        value: 'media',
        expanded: true,
        extension,
      });
      expect(expanded.getByText('Embedded search')).toBeInTheDocument();
    });
  });

  describe('selected-label', () => {
    it('should keep every option a radio with its label in the DOM', () => {
      render(SegmentedSelect, {
        ...baseProps,
        value: 'show',
        variant: 'selected-label',
      });

      // All labels stay in the DOM; the variant collapses unselected ones via
      // CSS so selection changes morph on the same elements.
      expect(screen.getAllByRole('radio')).toHaveLength(3);
      expect(screen.getByText('Media')).toBeInTheDocument();
      expect(screen.getByText('Shows')).toBeInTheDocument();
      expect(screen.getByText('Movies')).toBeInTheDocument();
    });

    it('should expose the variant via a data attribute', () => {
      const { container } = render(SegmentedSelect, {
        ...baseProps,
        value: 'media',
        variant: 'selected-label',
      });

      expect(
        container.querySelector('.trakt-segmented-select'),
      ).toHaveAttribute('data-variant', 'selected-label');
    });
  });

  describe('link segments', () => {
    const linkOptions: SegmentedSelectOption[] = [
      { value: 'media', label: 'Media', href: '?mode=media' },
      { value: 'show', label: 'Shows', href: '?mode=show' },
      { value: 'movie', label: 'Movies', href: '?mode=movie' },
      { value: 'people', label: 'People', href: '?m=people' },
      { value: 'lists', label: 'Lists', href: '?m=lists' },
    ];

    it('should keep collapsed link options out of the radio group and tab order', async () => {
      renderComponent(SegmentedSelect, {
        props: {
          options: linkOptions,
          value: 'media',
          ariaLabel: 'Content type',
          expandable: true,
          collapsedCount: 2,
          expanded: false,
          onChange: () => {},
        },
      });

      await waitFor(() => {
        expect(screen.getAllByRole('radio')).toHaveLength(3);
        expect(screen.queryByRole('radio', { name: 'People' })).toBeNull();
        expect(screen.queryByRole('radio', { name: 'Lists' })).toBeNull();
      });
    });

    it('should mark link options as aria-disabled when the select is disabled', async () => {
      renderComponent(SegmentedSelect, {
        props: {
          options: linkOptions,
          value: 'media',
          ariaLabel: 'Content type',
          disabled: true,
          onChange: () => {},
        },
      });

      await waitFor(() => {
        const link = screen.getByRole('radio', { name: 'Shows' });
        expect(link).toHaveAttribute('aria-disabled', 'true');
        expect(link).toHaveAttribute('tabindex', '-1');
      });
    });
  });
});
