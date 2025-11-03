import Button from './Button.svelte';

import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { fireEvent, screen, waitFor } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it, vi } from 'vitest';
import type { TraktButtonProps } from './TraktButtonProps.ts';

describe('Button', () => {
  const defaultProps: TraktButtonProps = {
    label: 'Test Button',
    children: createRawSnippet(() => ({
      render: () => '<span>Test Button Content</span>',
    })),
  };

  describe('type: button', () => {
    it('should render a button element', async () => {
      renderComponent(
        Button,
        {
          props: {
            ...defaultProps,
          },
        },
      );

      await waitFor(() => {
        const button = screen.getByRole('button', { name: 'Test Button' });
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent('Test Button Content');
      });
    });

    it('should render an icon', async () => {
      renderComponent(Button, {
        props: {
          ...defaultProps,
          icon: createRawSnippet(() => ({
            render: () => '<span>🔍</span>',
          })),
        },
      });

      await waitFor(() => {
        const icon = screen.getByText('🔍');

        expect(icon).toBeInTheDocument();
      });
    });

    it('should be default aligned when icon is present', async () => {
      renderComponent(Button, {
        props: {
          ...defaultProps,
          icon: createRawSnippet(() => ({
            render: () => '<span>🔍</span>',
          })),
        },
      });

      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('data-alignment', 'default');
      });
    });

    it('should render a subtitle', async () => {
      renderComponent(Button, {
        props: {
          ...defaultProps,
          subtitle: createRawSnippet(() => ({
            render: () => '<span>Subtitle</span>',
          })),
        },
      });

      await waitFor(() => {
        const subtitle = screen.getByText('Subtitle');

        expect(subtitle).toBeInTheDocument();
      });
    });

    it('should attach click event handler', async () => {
      const handler = vi.fn();

      renderComponent(Button, {
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
      renderComponent(Button, {
        props: {
          ...defaultProps,
          variant: 'secondary',
          size: 'small',
          style: 'textured',
          color: 'red',
        },
      });

      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('data-variant', 'secondary');
        expect(button).toHaveAttribute('data-style', 'textured');
        expect(button).toHaveAttribute('data-size', 'small');
        expect(button).toHaveAttribute('data-alignment', 'centered');
        expect(button).toHaveAttribute('data-color', 'red');
      });
    });

    it('should set button as disabled', async () => {
      renderComponent(Button, {
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
        Button,
        {
          props: {
            ...defaultProps,
            href: '/',
          },
        },
      );

      await waitFor(() => {
        const link = screen.getByRole('link', { name: 'Test Button' });
        expect(link).toBeInTheDocument();
        expect(link).toHaveTextContent('Test Button Content');
      });
    });

    it('should have a trakt-active-class when same url', async () => {
      renderComponent(
        Button,
        {
          props: {
            ...defaultProps,
            href: '/',
          },
        },
      );

      await waitFor(() => {
        const link = screen.getByRole('link', { name: 'Test Button' });
        expect(link).toHaveClass('trakt-link-active');
      });
    });

    it('should not have a trakt-active-class when different url', async () => {
      renderComponent(
        Button,
        {
          props: {
            ...defaultProps,
            href: '/test',
          },
        },
      );

      await waitFor(() => {
        const link = screen.getByRole('link', { name: 'Test Button' });
        expect(link).not.toHaveClass('trakt-link-active');
      });
    });

    it('should stay focused when clicked', async () => {
      renderComponent(
        Button,
        {
          props: {
            ...defaultProps,
            href: '/',
          },
        },
      );

      await waitFor(() => {
        const link = screen.getByRole('link', { name: 'Test Button' });

        expect(link).toHaveAttribute('data-sveltekit-keepfocus');
      });
    });
  });
});
