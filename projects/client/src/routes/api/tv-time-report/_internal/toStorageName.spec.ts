import { describe, expect, it } from 'vitest';
import { toStorageName } from './toStorageName.ts';

describe('util: toStorageName', () => {
  it('should keep plain export file names as is', () => {
    expect(toStorageName('gdpr-data.zip')).toBe('gdpr-data.zip');
  });

  it('should strip path segments', () => {
    expect(toStorageName('../../etc/passwd')).toBe('passwd');
    expect(toStorageName('C:\\exports\\gdpr-data.zip')).toBe('gdpr-data.zip');
  });

  it('should replace unsafe characters', () => {
    expect(toStorageName('gdpr-data (1).zip')).toBe('gdpr-data _1_.zip');
    expect(toStorageName('TVTime_كل_البيانات.csv')).toBe('TVTime____.csv');
  });

  it('should fall back to a generic name when nothing is left', () => {
    expect(toStorageName('')).toBe('file');
  });
});
