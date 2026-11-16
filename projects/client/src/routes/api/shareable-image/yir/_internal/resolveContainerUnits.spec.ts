import { describe, expect, it } from 'vitest';
import { resolveContainerUnits } from './resolveContainerUnits.ts';

describe('util: resolveContainerUnits', () => {
  it('should turn container width units into pixels of the given width', () => {
    expect(
      resolveContainerUnits({
        html: '.name{font-size:10.5cqw;padding:5cqw .5cqw;margin:-2cqw}',
        width: 400,
      }),
    ).toBe('.name{font-size:42px;padding:20px 2px;margin:-8px}');
  });

  it('should leave other units and plain text alone', () => {
    const html = '<b>2cqwx</b><style>.a{width:50%;height:3cqh}</style>';

    expect(resolveContainerUnits({ html, width: 400 })).toBe(html);
  });
});
