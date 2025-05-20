import { describe, expect, it, vi } from 'vitest';
import { FilterKey } from '../models/Filter.ts';
import { processFilterParams } from './processFilterParams.ts';

describe('processFilterParams', () => {
  it('should call callback for each valid filter key', () => {
    const callback = vi.fn();
    const params: Array<[string, string]> = [
      [FilterKey.Genres, 'action'],
    ];

    processFilterParams(params, callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(FilterKey.Genres, 'action');
  });

  it('should not call callback when no valid filter keys are present', () => {
    const callback = vi.fn();
    const params: Array<[string, string]> = [
      ['invalid1', 'value1'],
    ];

    processFilterParams(params, callback);

    expect(callback).not.toHaveBeenCalled();
  });
});
