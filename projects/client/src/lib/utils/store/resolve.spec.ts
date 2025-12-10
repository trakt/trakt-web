import { BehaviorSubject, of } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { resolve } from './resolve.ts';

describe('resolve', () => {
  it('should resolve the current value of a BehaviorSubject', async () => {
    const subject = new BehaviorSubject(42);
    const result = await resolve(subject);
    expect(result).toBe(42);
  });

  it('should resolve updated BehaviorSubject values', async () => {
    const subject = new BehaviorSubject('initial');
    subject.next('updated');
    const result = await resolve(subject);
    expect(result).toBe('updated');
  });

  it('should work with different data types', async () => {
    const numberSubject = new BehaviorSubject(123);
    const stringSubject = new BehaviorSubject('test');
    const objectSubject = new BehaviorSubject({ key: 'value' });
    const arraySubject = new BehaviorSubject([1, 2, 3]);

    expect(await resolve(numberSubject)).toBe(123);
    expect(await resolve(stringSubject)).toBe('test');
    expect(await resolve(objectSubject)).toEqual({ key: 'value' });
    expect(await resolve(arraySubject)).toEqual([1, 2, 3]);
  });

  it('should resolve Observable', async () => {
    const obs = of('test');
    expect(await resolve(obs)).toBe('test');
  });
});
