import ActionButton from './ActionButton.svelte';

import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { fireEvent, screen, waitFor } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it, vi } from 'vitest';
import type { TraktActionButtonProps } from './TraktActionButtonProps.ts';

describe('ActionButton', () => {
  const defaultProps: TraktActionButtonProps = {
    label: 'Test ActionButton',
    children: createRawSnippet(() => ({
      render: () => '<span>Test ActionButton Content</span>',
    })),
  };

  describe('type: ActionButton', () => {
    it('should render a ActionButton element', async () => {
      renderComponent(
        ActionButton,
        {
          props: {
            ...defaultProps,
          },
        },
      );

      await waitFor(() => {
        const button = screen.getByRole('button', {
          name: 'Test ActionButton',
        });
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent('Test ActionButton Content');
        expect(button).toHaveAttribute('data-color', 'default');
        expect(button).toHaveAttribute('data-variant', 'primary');
      });
    });

    it('should attach click event handler', async () => {
      const handler = vi.fn();

      renderComponent(ActionButton, {
        props: {
          ...defaultProps,
          onclick: handler,
        },
      });

      await waitFor(async () => {
        const button = screen.getByRole('button');
        await fireEvent.click(button);

        expect(handler).toHaveBeenCalledTimes(1);
      });
    });

    it('should apply correct styles based on props', async () => {
      renderComponent(ActionButton, {
        props: {
          ...defaultProps,
          color: 'purple',
          variant: 'secondary',
        },
      });

      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('data-color', 'purple');
        expect(button).toHaveAttribute('data-variant', 'secondary');
      });
    });

    it('should set ActionButton as disabled', async () => {
      renderComponent(ActionButton, {
        props: {
          ...defaultProps,
          disabled: true,
        },
      });

      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
      });
    });
  });

  describe('type: link', () => {
    it('should render a link component', async () => {
      renderComponent(
        ActionButton,
        {
          props: {
            ...defaultProps,
            href: '/',
          },
        },
      );

      await waitFor(() => {
        const link = screen.getByRole('link', { name: 'Test ActionButton' });
        expect(link).toBeInTheDocument();
        expect(link).toHaveTextContent('Test ActionButton Content');
      });
    });

    it('should have a trakt-active-class when same url', async () => {
      renderComponent(
        ActionButton,
        {
          props: {
            ...defaultProps,
            href: '/',
          },
        },
      );

      await waitFor(() => {
        const link = screen.getByRole('link', { name: 'Test ActionButton' });
        expect(link).toHaveClass('trakt-link-active');
      });
    });

    it('should not have a trakt-active-class when different url', async () => {
      renderComponent(
        ActionButton,
        {
          props: {
            ...defaultProps,
            href: '/test',
          },
        },
      );

      await waitFor(() => {
        const link = screen.getByRole('link', { name: 'Test ActionButton' });
        expect(link).not.toHaveClass('trakt-link-active');
      });
    });

    it('should stay focused when clicked', async () => {
      renderComponent(
        ActionButton,
        {
          props: {
            ...defaultProps,
            href: '/',
          },
        },
      );

      await waitFor(() => {
        const link = screen.getByRole('link', { name: 'Test ActionButton' });

        expect(link).toHaveAttribute('data-sveltekit-keepfocus');
      });
    });
  });
});
