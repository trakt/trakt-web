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

  it('should keep the checksums it already produced', () => {
    expect(checksum('test string')).toBe('2mt0onmfr6qv');
    expect(checksum('{"type":"object"}')).toBe('2anrb51ppav9k2b6s3');
    expect(checksum('x'.repeat(1000))).toBe('2s9ubarqm75polj3el90o3e7cucs1j00');
  });

  it('should hash a large input without growing the hash', () => {
    expect(checksum('x'.repeat(1_000_000))).toHaveLength(32);
  }, 2000);
});
