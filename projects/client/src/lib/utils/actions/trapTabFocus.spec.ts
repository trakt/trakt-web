import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { fireEvent } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { trapTabFocus } from './trapTabFocus.ts';

describe('action: trapTabFocus', () => {
  let container: HTMLElement;
  let first: HTMLButtonElement;
  let second: HTMLButtonElement;
  let last: HTMLButtonElement;
  let destroy: () => void;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = `
      <button id="first">first</button>
      <button id="second">second</button>
      <button id="disabled" disabled>disabled</button>
      <div inert><button id="inert">inert</button></div>
      <button id="last">last</button>
      <button id="untabbable" tabindex="-1">untabbable</button>
    `;
    document.body.appendChild(container);

    first = assertDefined(
      container.querySelector<HTMLButtonElement>('#first'),
    );
    second = assertDefined(
      container.querySelector<HTMLButtonElement>('#second'),
    );
    last = assertDefined(
      container.querySelector<HTMLButtonElement>('#last'),
    );
    destroy = trapTabFocus(container).destroy;
  });

  afterEach(() => {
    destroy();
    container.remove();
  });

  it('should wrap from the last element to the first', async () => {
    last.focus();

    const notPrevented = await fireEvent.keyDown(last, { key: 'Tab' });

    expect(notPrevented).toBe(false);
    expect(document.activeElement).toBe(first);
  });

  it('should wrap from the first element to the last with shift', async () => {
    first.focus();

    await fireEvent.keyDown(first, { key: 'Tab', shiftKey: true });

    expect(document.activeElement).toBe(last);
  });

  it('should wrap backwards from the container itself', async () => {
    container.tabIndex = -1;
    container.focus();

    await fireEvent.keyDown(container, { key: 'Tab', shiftKey: true });

    expect(document.activeElement).toBe(last);
  });

  it('should leave tabbing inside alone', async () => {
    second.focus();

    const notPrevented = await fireEvent.keyDown(second, { key: 'Tab' });

    expect(notPrevented).toBe(true);
  });

  it('should ignore other keys', async () => {
    last.focus();

    const notPrevented = await fireEvent.keyDown(last, { key: 'Enter' });

    expect(notPrevented).toBe(true);
    expect(document.activeElement).toBe(last);
  });
});
