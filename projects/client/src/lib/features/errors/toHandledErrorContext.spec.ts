import { describe, expect, it } from 'vitest';
import { toHandledErrorContext } from './toHandledErrorContext.ts';

const base = {
  status: 500,
  message: 'Internal Error',
  event: { route: { id: '/home' } },
};

describe('util: toHandledErrorContext', () => {
  it('should describe a thrown undefined', () => {
    expect(toHandledErrorContext({ ...base, error: undefined })).toEqual({
      route: '/home',
      status: 500,
      message: 'Internal Error',
      valueType: 'undefined',
      constructorName: null,
      ownKeys: [],
      hasStack: false,
      stack: null,
    });
  });

  it('should describe a plain object rejection', () => {
    const context = toHandledErrorContext({
      ...base,
      error: { code: 'E', message: 'nope' },
    });

    expect(context.valueType).toBe('object');
    expect(context.constructorName).toBe('Object');
    expect(context.ownKeys).toEqual(['code', 'message']);
  });

  it('should describe a real error', () => {
    const context = toHandledErrorContext({
      ...base,
      error: new TypeError('boom'),
    });

    expect(context.constructorName).toBe('TypeError');
    expect(context.hasStack).toBe(true);
  });

  it('should keep the top of the stack', () => {
    const error = new SyntaxError('Unexpected end of input');
    error.stack = [
      'SyntaxError: Unexpected end of input',
      ...Array.from({ length: 20 }, (_, index) => `    at frame${index}`),
    ].join('\n');

    const { stack } = toHandledErrorContext({ ...base, error });

    expect(stack?.split('\n')).toHaveLength(12);
    expect(stack?.split('\n').at(1)).toBe('    at frame0');
  });

  it('should report null as its own type', () => {
    expect(toHandledErrorContext({ ...base, error: null }).valueType).toBe(
      'null',
    );
  });

  it('should not throw for a value whose inspection throws', () => {
    const { proxy, revoke } = Proxy.revocable({}, {});
    revoke();

    const context = toHandledErrorContext({ ...base, error: proxy });

    expect(context.valueType).toBe('object');
    expect(context.constructorName).toBeNull();
    expect(context.ownKeys).toEqual([]);
    expect(context.hasStack).toBe(false);
    expect(context.stack).toBeNull();
  });
});
