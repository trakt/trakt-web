import { describe, expect, it } from 'vitest';
import { sha256 } from './sha256.ts';

describe('sha256', () => {
  it('computes the correct lowercase hex hash', async () => {
    // using "123456" as an example user ID
    const hash = await sha256('123456');
    expect(hash).toBe(
      '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
    );
  });
});
