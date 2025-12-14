import { of, Subject } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { resolve } from './resolve.ts';

describe('resolve', () => {
  it('should resolve the first emitted value from an Observable', async () => {
    const obs = of(42);
    const result = await resolve(obs);
    expect(result).toBe(42);
  });

  it('should resolve updated values emitted by a Subject', async () => {
    const subj = new Subject<string>();
    setTimeout(() => subj.next('updated'), 10);
    const result = await resolve(subj);
    expect(result).toBe('updated');
  });

  it('should work with different data types', async () => {
    expect(await resolve(of(123))).toBe(123);
    expect(await resolve(of('test'))).toBe('test');
    expect(await resolve(of({ key: 'value' }))).toEqual({ key: 'value' });
    expect(await resolve(of([1, 2, 3]))).toEqual([1, 2, 3]);
  });

  it('should reject if no value is emitted within the timeout', async () => {
    const subj = new Subject<number>();
    await expect(resolve(subj, 50)).rejects.toThrow('No value resolved');
  });
});
