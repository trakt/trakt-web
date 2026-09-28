import { describe, expect, it } from 'vitest';
import { stripPastedLinks } from './stripPastedLinks.ts';

describe('util: stripPastedLinks', () => {
  it('should keep the link text and drop the link', () => {
    expect(
      stripPastedLinks('<p>see <a href="https://x.y">this <b>page</b></a></p>'),
    ).toBe('<p>see this <b>page</b></p>');
  });

  it('should leave html without links untouched', () => {
    expect(stripPastedLinks('<p>plain <i>text</i></p>')).toBe(
      '<p>plain <i>text</i></p>',
    );
  });
});
