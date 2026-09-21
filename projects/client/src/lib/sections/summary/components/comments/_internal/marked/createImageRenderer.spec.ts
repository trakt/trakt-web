import type { Tokens } from 'marked';
import { describe, expect, it } from 'vitest';
import { createImageRenderer } from './createImageRenderer.ts';

describe('createImageRenderer', () => {
  const render = (href: string, text = 'poster') =>
    createImageRenderer()({
      type: 'image',
      raw: `![${text}](${href})`,
      href,
      title: null,
      text,
    } as Tokens.Image);

  it('createImageRenderer should defer a safe image to the default renderer', () => {
    expect(render('https://trakt.tv/poster.jpg')).toBe(false);
  });

  it('createImageRenderer should fall back to the alt text for a script source', () => {
    expect(render('javascript:alert(1)')).toBe('poster');
  });

  it('createImageRenderer should escape the alt text it falls back to', () => {
    expect(render('data:text/html,x', '<img src=y onerror=alert(1)>')).toBe(
      '&lt;img src=y onerror=alert(1)&gt;',
    );
  });
});
