import NoveltySwitch from './NoveltySwitch.svelte';

import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import type { NoveltySwitchProps } from './NoveltySwitchProps.ts';

describe('NoveltySwitch', () => {
  const defaultProps: NoveltySwitchProps = {
    label: 'Test Switch',
  };

  it('should render a switch element', () => {
    render(NoveltySwitch, defaultProps);

    expect(screen.getByRole('switch', { name: 'Test Switch' }))
      .toBeInTheDocument();
  });

  it('should render inner text', () => {
    render(NoveltySwitch, {
      ...defaultProps,
      innerText: 'Web',
    });

    expect(screen.getByText('Web')).toBeInTheDocument();
  });

  it('should hide inner text while indeterminate', () => {
    render(NoveltySwitch, {
      ...defaultProps,
      innerText: 'Web',
      indeterminate: true,
    });

    expect(screen.queryByText('Web')).not.toBeInTheDocument();
  });

  it('should apply correct styles based on props', () => {
    render(NoveltySwitch, {
      ...defaultProps,
      color: 'red',
    });

    expect(screen.getByRole('switch')).toHaveAttribute('data-color', 'red');
  });
});
