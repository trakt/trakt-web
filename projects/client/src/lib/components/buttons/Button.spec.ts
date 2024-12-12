// @ts-ignore TODO: (@seferturan): fix typings in vs code
import Button from './Button.svelte';

import type { TraktButtonProps } from '$lib/components/buttons/TraktButtonProps.ts';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it, vi } from 'vitest';

// TODO: investigate if there is a way to mock the store without using the $app/stores path
vi.mock('$app/stores', () => ({
  page: {
    subscribe: (resolver: (_: Record<string, unknown>) => void) => {
      resolver({
        url: new URL('https://example.com'),
      });

      return () => {};
    },
  },
}));

// TODO: investigate if there is a way to mock the navigation without using the $app/navigation path
// Or we can do it globally
vi.mock('$app/navigation', () => ({
  goto: vi.fn(() => Promise.resolve()),
}));

describe('Button', () => {
  const defaultProps: TraktButtonProps = {
    label: 'Test Button',
    children: createRawSnippet(() => ({
      render: () => 'Test Button Content',
    })),
  };

  describe('type: button', () => {
    it('should render a button element', () => {
      render(
        Button,
        {
          props: {
            ...defaultProps,
          },
        },
      );

      const button = screen.getByRole('button', { name: 'Test Button' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Test Button Content');
    });

    it('should render an icon', () => {
      render(Button, {
        ...defaultProps,
        icon: createRawSnippet(() => ({
          render: () => '🔍',
        })),
      });

      const icon = screen.getByText('🔍');

      expect(icon).toBeInTheDocument();
    });

    it('should be default aligned when icon is present', () => {
      render(Button, {
        ...defaultProps,
        icon: createRawSnippet(() => ({
          render: () => '🔍',
        })),
      });

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-alignment', 'default');
    });

    it('should render a subtitle', () => {
      render(Button, {
        ...defaultProps,
        subtitle: createRawSnippet(() => ({
          render: () => 'Subtitle',
        })),
      });

      const subtitle = screen.getByText('Subtitle');

      expect(subtitle).toBeInTheDocument();
    });

    it('should attach click event handler', async () => {
      const handler = vi.fn();

      render(Button, {
        ...defaultProps,
        onclick: handler,
      });

      const button = screen.getByRole('button');
      await fireEvent.click(button);

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should apply correct styles based on props', () => {
      render(Button, {
        ...defaultProps,
        variant: 'secondary',
        size: 'small',
        style: 'textured',
      });

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-variant', 'secondary');
      expect(button).toHaveAttribute('data-style', 'textured');
      expect(button).toHaveAttribute('data-size', 'small');
      expect(button).toHaveAttribute('data-alignment', 'centered');
    });

    it('should set button as disabled', () => {
      render(Button, {
        ...defaultProps,
        disabled: true,
      });

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });
  });

  describe('type: link', () => {
    it('should render a link component', () => {
      render(
        Button,
        {
          props: {
            ...defaultProps,
            href: '/',
          },
        },
      );

      const link = screen.getByRole('link', { name: 'Test Button' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveTextContent('Test Button Content');
    });

    it('should have a trakt-active-class when same url', () => {
      render(
        Button,
        {
          props: {
            ...defaultProps,
            href: '/',
          },
        },
      );

      const link = screen.getByRole('link', { name: 'Test Button' });
      expect(link).toHaveClass('trakt-link-active');
    });

    it('should not have a trakt-active-class when different url', () => {
      render(
        Button,
        {
          props: {
            ...defaultProps,
            href: '/test',
          },
        },
      );

      const link = screen.getByRole('link', { name: 'Test Button' });
      expect(link).not.toHaveClass('trakt-link-active');
    });

    it('should stay focused when clicked', async () => {
      render(
        Button,
        {
          props: {
            ...defaultProps,
            href: '/',
          },
        },
      );

      const link = screen.getByRole('link', { name: 'Test Button' });
      await fireEvent.click(link);

      expect(link).toHaveFocus();
    });
  });
});
