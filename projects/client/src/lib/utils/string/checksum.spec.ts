import { describe, expect, it } from 'vitest';
import { checksum } from './checksum.ts';

describe('checksum', () => {
  it('should generate consistent checksums for same input', () => {
    const input = 'test string';
    expect(checksum(input)).toBe(checksum(input));
  });

  it('should generate different checksums for different inputs', () => {
    expect(checksum('test1')).not.toBe(checksum('test2'));
  });

  it('should handle empty strings', () => {
    expect(checksum('')).toBeDefined();
    expect(typeof checksum('')).toBe('string');
  });

  it('should handle special characters', () => {
    const input = '!@#$%^&*()_+';
    expect(checksum(input)).toBeDefined();
  });

  it('should handle unicode characters', () => {
    const input = '你好世界';
    expect(checksum(input)).toBeDefined();
  });
});
