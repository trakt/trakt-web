import { describe, expect, it } from 'vitest';
import { toRejectionBreadcrumb } from './toRejectionBreadcrumb.ts';

const dispatchProbe = Object.assign(new Error(), {
  stack: [
    'Error',
    ...Array.from({ length: 20 }, (_, index) => `    at frame${index}`),
  ].join('\n'),
});

describe('util: toRejectionBreadcrumb', () => {
  it('should describe a reason that is not an error', () => {
    const breadcrumb = toRejectionBreadcrumb({
      event: { type: 'unhandledrejection', isTrusted: true, reason: {} },
      dispatchProbe,
    });

    expect(breadcrumb.data?.reason).toMatchObject({
      valueType: 'object',
      constructorName: 'Object',
      ownKeys: [],
      hasStack: false,
    });
  });

  it('should leave out the dispatch stack for a browser rejection', () => {
    const breadcrumb = toRejectionBreadcrumb({
      event: { type: 'unhandledrejection', isTrusted: true, reason: {} },
      dispatchProbe,
    });

    expect(breadcrumb.data?.dispatchStack).toBeNull();
  });

  it('should keep the top of the dispatch stack for a scripted rejection', () => {
    const breadcrumb = toRejectionBreadcrumb({
      event: new CustomEvent('unhandledrejection', { detail: 'boom' }),
      dispatchProbe,
    });

    expect(breadcrumb.message).toBe('CustomEvent unhandledrejection');
    expect(breadcrumb.data?.detail).toMatchObject({ valueType: 'string' });
    expect(String(breadcrumb.data?.dispatchStack).split('\n')).toHaveLength(12);
  });
});
