import { describe, expect, it } from 'vitest';
import { isSuccessResponse } from './isSuccessResponse.ts';

describe('isSuccessResponse', () => {
  it('should return true for single successful response', () => {
    const response = { status: 200, data: 'test' };
    expect(isSuccessResponse(response)).toBe(true);
  });

  it('should return true for array of successful responses', () => {
    const responses = [
      { status: 200, data: 'test1' },
      { status: 200, data: 'test2' },
    ];
    expect(isSuccessResponse(responses)).toBe(true);
  });

  it('should return false for single failed response', () => {
    const response = { status: 404, error: 'Not found' };
    expect(isSuccessResponse(response)).toBe(false);
  });

  it('should return false if any response in array fails', () => {
    const responses = [
      { status: 200, data: 'test1' },
      { status: 404, error: 'Not found' },
      { status: 200, data: 'test3' },
    ];
    expect(isSuccessResponse(responses)).toBe(false);
  });
});
