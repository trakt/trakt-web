import Switch from './Switch.svelte';

import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import type { SwitchProps } from './SwitchProps.ts';

describe('Switch', () => {
  const defaultProps: SwitchProps = {
    label: 'Test Switch',
  };

  it('should render a switch element', () => {
    render(
      Switch,
      defaultProps,
    );

    const switchToggle = screen.getByRole('switch', { name: 'Test Switch' });
    expect(switchToggle).toBeInTheDocument();
  });

  it('should render inner text', () => {
    render(Switch, {
      ...defaultProps,
      innerText: 'Lite',
    });

    const subtitle = screen.getByText('Lite');

    expect(subtitle).toBeInTheDocument();
  });

  it('should toggle', async () => {
    render(Switch, defaultProps);

    const switchToggle = screen.getByRole('switch');
    expect(switchToggle).not.toBeChecked();

    await fireEvent.click(switchToggle);
    expect(switchToggle).toBeChecked();
  });

  it('should apply correct styles based on props', () => {
    render(Switch, {
      ...defaultProps,
      color: 'red',
    });

    const switchToggle = screen.getByRole('switch');
    expect(switchToggle).toHaveAttribute('data-color', 'red');
  });

  it('should set switch as disabled', () => {
    render(Switch, {
      ...defaultProps,
      disabled: true,
    });

    const switchToggle = screen.getByRole('switch');
    expect(switchToggle).toBeDisabled();
  });
});
