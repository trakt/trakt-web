import type { Tokens } from 'marked';
import { describe, expect, it } from 'vitest';
import { createHtmlRenderer } from './createHtmlRenderer.ts';

describe('createHtmlRenderer', () => {
  const render = (text: string) =>
    createHtmlRenderer()({ text } as Tokens.HTML);

  it('createHtmlRenderer should escape a tag that would run script', () => {
    expect(render('<img src=x onerror=alert(1)>')).toBe(
      '&lt;img src=x onerror=alert(1)&gt;',
    );
  });

  it('createHtmlRenderer should escape quotes and ampersands', () => {
    expect(render(`<a href="x" title='y'>&</a>`)).toBe(
      '&lt;a href=&quot;x&quot; title=&#39;y&#39;&gt;&amp;&lt;/a&gt;',
    );
  });

  it('createHtmlRenderer should leave text without markup alone', () => {
    expect(render('plain text')).toBe('plain text');
  });
});
