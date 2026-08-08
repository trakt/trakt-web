import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import FormInput from './FormInput.svelte';

describe('component: FormInput', () => {
  it('should point aria-describedby at the rendered error label', async () => {
    const { container, findByRole } = render(FormInput, {
      props: {
        onChange: () => {},
        disabled: false,
        placeholder: '',
        value: 'nope',
        validation: {
          isValid: (value: string) => value === 'ok',
          errorText: 'Value must be ok.',
        },
      },
    });

    const input = await findByRole('textbox');
    const describedBy = input.getAttribute('aria-describedby');

    expect(describedBy).not.toBeNull();
    expect(container.querySelector(`#${describedBy}`)?.textContent?.trim())
      .toBe('Value must be ok.');
  });
});
