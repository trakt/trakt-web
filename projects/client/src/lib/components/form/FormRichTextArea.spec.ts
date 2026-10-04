import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import FormRichTextArea from './FormRichTextArea.svelte';

const renderRichTextArea = async (value: string) => {
  const { container } = render(FormRichTextArea, {
    props: {
      onChange: () => {},
      disabled: false,
      placeholder: 'Add a review...',
      value,
      validation: {
        isValid: (value: string) => value.trim().split(/\s+/).length >= 5,
        errorText: 'Reviews must be at least 5 words.',
      },
    },
  });

  await waitFor(() => {
    expect(screen.getByRole('textbox')).toBeTruthy();
  });

  const field = container.querySelector('.trakt-form-rich-textarea');
  if (!field) throw new Error('rich text field not rendered');

  return { container, field };
};

describe('component: FormRichTextArea', () => {
  it('should not flag an invalid value before the field is left', async () => {
    const { field } = await renderRichTextArea('two words');

    expect(field.classList.contains('has-error')).toBe(false);
  });

  it('should not flag an invalid value when focus moves within the field', async () => {
    const { field } = await renderRichTextArea('two words');

    await fireEvent.focusOut(screen.getByRole('textbox'), {
      relatedTarget: screen.getByRole('button', { name: 'Bold' }),
    });

    expect(field.classList.contains('has-error')).toBe(false);
  });

  it('should flag an invalid value once the field is left', async () => {
    const { container, field } = await renderRichTextArea('two words');

    await fireEvent.focusOut(screen.getByRole('textbox'));

    const describedBy = screen.getByRole('textbox').getAttribute(
      'aria-describedby',
    );

    expect(field.classList.contains('has-error')).toBe(true);
    expect(describedBy).not.toBeNull();
    expect(container.querySelector(`#${describedBy}`)?.textContent?.trim())
      .toBe('Reviews must be at least 5 words.');
  });

  it('should not flag an empty value once the field is left', async () => {
    const { field } = await renderRichTextArea('');

    await fireEvent.focusOut(screen.getByRole('textbox'));

    expect(field.classList.contains('has-error')).toBe(false);
  });
});
