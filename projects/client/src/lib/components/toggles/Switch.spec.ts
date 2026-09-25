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

  it('should toggle', async () => {
    render(Switch, defaultProps);

    const switchToggle = screen.getByRole('switch');
    expect(switchToggle).not.toBeChecked();

    await fireEvent.click(switchToggle);
    expect(switchToggle).toBeChecked();
  });

  it('should report a mixed state', () => {
    render(Switch, {
      ...defaultProps,
      indeterminate: true,
    });

    expect(screen.getByRole('switch')).toBePartiallyChecked();
  });

  it('should set switch as disabled', () => {
    render(Switch, {
      ...defaultProps,
      disabled: true,
    });

    const switchToggle = screen.getByRole('switch');
    expect(switchToggle).toBeDisabled();
  });

  it('should not render any text inside the control', () => {
    render(Switch, {
      ...defaultProps,
      checked: true,
    });

    expect(screen.getByRole('switch').closest('label')?.textContent?.trim())
      .toBe('');
  });
});
