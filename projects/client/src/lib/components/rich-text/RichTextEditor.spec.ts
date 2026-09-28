import { render, screen, waitFor } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import RichTextEditor from './RichTextEditor.svelte';

const baseProps = {
  onChange: vi.fn(),
  placeholder: 'Add a review...',
  label: 'Add a review...',
};

describe('component: RichTextEditor', () => {
  it('should show stored markdown as formatted text', async () => {
    const { container } = render(RichTextEditor, {
      ...baseProps,
      value: 'It was **great**, he is [spoiler]the killer[/spoiler]',
    });

    await waitFor(() => {
      expect(container.querySelector('strong')?.textContent).toBe('great');
    });
    expect(container.querySelector('[data-spoiler]')?.textContent).toBe(
      'the killer',
    );
    expect(container.textContent).not.toContain('**');
    expect(container.textContent).not.toContain('[spoiler]');
  });

  it('should offer a labelled toolbar and editable text box', async () => {
    render(RichTextEditor, {
      ...baseProps,
      value: '',
      mentions: [{ name: 'Steve Carell', href: 'https://app.trakt.tv/p/x' }],
    });

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeTruthy();
    });

    expect(screen.getByRole('toolbar')).toBeTruthy();
    for (const name of ['Bold', 'Italic', 'Hide as spoiler', 'Mention cast']) {
      expect(
        screen.getByRole('button', { name }).getAttribute('aria-pressed'),
      ).toBe('false');
    }
  });

  it('should not offer mentions when there is nobody to mention', async () => {
    render(RichTextEditor, { ...baseProps, value: '' });

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeTruthy();
    });

    expect(screen.queryByRole('button', { name: 'Mention cast' })).toBeNull();
  });

  it('should empty the editor when the value is cleared', async () => {
    const { container, rerender } = render(RichTextEditor, {
      ...baseProps,
      value: 'hello there',
    });

    await waitFor(() => {
      expect(container.textContent).toContain('hello there');
    });

    await rerender({ ...baseProps, value: '' });

    await waitFor(() => {
      expect(container.textContent).not.toContain('hello there');
    });
  });

  it('should make the text box inert while disabled', async () => {
    const { container, rerender } = render(RichTextEditor, {
      ...baseProps,
      value: '',
    });

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeTruthy();
    });

    const surface = container.querySelector<HTMLElement>('.editor-surface');
    expect(surface?.inert).toBeFalsy();

    await rerender({ ...baseProps, value: '', disabled: true });

    expect(surface?.inert).toBe(true);
  });
});
