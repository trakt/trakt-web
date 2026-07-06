import { describe, expect, it } from 'vitest';
import { validateTvTimeReport } from './validateTvTimeReport.ts';

const fileOf = (name: string, sizeBytes: number): File =>
  new File([new Uint8Array(sizeBytes)], name, {
    type: 'application/octet-stream',
  });

describe('util: validateTvTimeReport', () => {
  it('should accept a valid message with a csv file', () => {
    const result = validateTvTimeReport({
      message: 'Nothing imported from my GDPR export.',
      files: [fileOf('tracking-prod-records.csv', 1024)],
    });

    expect(result).toEqual({ ok: true });
  });

  it('should accept a zip file', () => {
    const result = validateTvTimeReport({
      message: 'here it is',
      files: [fileOf('export.zip', 2048)],
    });

    expect(result.ok).toBe(true);
  });

  it('should reject an empty message', () => {
    const result = validateTvTimeReport({
      message: '   ',
      files: [fileOf('export.zip', 10)],
    });

    expect(result).toEqual({ ok: false, reason: 'message-required' });
  });

  it('should reject an overly long message', () => {
    const result = validateTvTimeReport({
      message: 'x'.repeat(5_001),
      files: [fileOf('export.zip', 10)],
    });

    expect(result).toEqual({ ok: false, reason: 'message-too-long' });
  });

  it('should reject when no files are attached', () => {
    const result = validateTvTimeReport({ message: 'help', files: [] });

    expect(result).toEqual({ ok: false, reason: 'no-files' });
  });

  it('should reject too many files', () => {
    const files = Array.from(
      { length: 11 },
      (_, index) => fileOf(`file-${index}.csv`, 1),
    );

    const result = validateTvTimeReport({ message: 'help', files });

    expect(result).toEqual({ ok: false, reason: 'too-many-files' });
  });

  it('should reject an empty (0-byte) file', () => {
    const result = validateTvTimeReport({
      message: 'help',
      files: [fileOf('export.zip', 0)],
    });

    expect(result).toEqual({ ok: false, reason: 'empty-file' });
  });

  it('should reject a disallowed extension', () => {
    const result = validateTvTimeReport({
      message: 'help',
      files: [fileOf('export.json', 10)],
    });

    expect(result).toEqual({ ok: false, reason: 'invalid-extension' });
  });

  it('should reject a file over the per-file size cap', () => {
    const result = validateTvTimeReport({
      message: 'help',
      files: [fileOf('big.zip', 10 * 1024 * 1024 + 1)],
    });

    expect(result).toEqual({ ok: false, reason: 'file-too-large' });
  });

  it('should reject when the combined size exceeds the total cap', () => {
    const files = Array.from(
      { length: 3 },
      (_, index) => fileOf(`part-${index}.zip`, 9 * 1024 * 1024),
    );

    const result = validateTvTimeReport({ message: 'help', files });

    expect(result).toEqual({ ok: false, reason: 'total-too-large' });
  });
});
