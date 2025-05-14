import { waitFor } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  CHECK_INTERVAL,
  MAX_WAIT_TIME,
  waitForDynamicContent,
} from './waitForDynamicContent.ts';

describe('waitForDynamicContent', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    vi.useFakeTimers();
  });

  afterEach(() => {
    container.remove();
    vi.useRealTimers();
  });

  it('should resolve immediately if no dynamic elements exist', async () => {
    const promise = waitForDynamicContent();
    await expect(promise).resolves.toBeNull();
  });

  it('should wait for dynamic content to load', async () => {
    let resolved = false;

    container.setAttribute('data-dynamic-selector', '.dynamic-item');

    const promise = waitForDynamicContent();
    promise.then(() => {
      resolved = true;
    });

    vi.advanceTimersByTime(CHECK_INTERVAL);
    expect(resolved).toBe(false);

    const dynamicItem = document.createElement('div');
    dynamicItem.className = 'dynamic-item';
    container.appendChild(dynamicItem);

    vi.advanceTimersByTime(CHECK_INTERVAL);

    await waitFor(() => expect(resolved).toBe(true));
  });

  it('should resolve after MAX_WAIT_TIME if content never loads', async () => {
    let resolved = false;

    container.setAttribute('data-dynamic-selector', '.never-loads');

    const promise = waitForDynamicContent();
    promise.then(() => {
      resolved = true;
    });

    vi.advanceTimersByTime(MAX_WAIT_TIME + CHECK_INTERVAL);

    await waitFor(() => expect(resolved).toBe(true));
  });
});
