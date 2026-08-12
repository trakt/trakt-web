import { CancelledError } from '@tanstack/query-core';
import { describe, expect, it } from 'vitest';
import { rethrowUnlessCancelled } from './rethrowUnlessCancelled.ts';

describe('rethrowUnlessCancelled', () => {
  it('should swallow cancellations', () => {
    expect(() => rethrowUnlessCancelled(new CancelledError())).not.toThrow();
  });

  it('should rethrow request errors', () => {
    const error = new Error('Internal Server Error');

    expect(() => rethrowUnlessCancelled(error)).toThrow(error);
  });

  it('should rethrow non-error rejections', () => {
    expect(() => rethrowUnlessCancelled('nope')).toThrow();
  });
});
