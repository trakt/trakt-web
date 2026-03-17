import { afterEach, describe, expect, it, vi } from 'vitest';
import { toSvgBlob } from './toSvgBlob.ts';

function makeContainer(innerHTML: string): Element {
  const div = document.createElement('div');
  div.innerHTML = innerHTML;
  document.body.appendChild(div);
  return div;
}

function readBlob(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsText(blob);
  });
}

describe('toSvgBlob', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('returns null when container has no svg', () => {
    const container = makeContainer('<div>no svg here</div>');
    expect(toSvgBlob(container)).toBeNull();
  });

  it('returns a Blob of type image/svg+xml when svg is present', () => {
    const container = makeContainer('<svg xmlns="http://www.w3.org/2000/svg"><rect /></svg>');
    const blob = toSvgBlob(container);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob?.type).toBe('image/svg+xml');
  });

  it('blob contains the serialized svg content', async () => {
    const container = makeContainer(
      '<svg xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="5" /></svg>',
    );
    const blob = toSvgBlob(container)!;
    const text = await readBlob(blob);
    expect(text).toContain('<circle');
    expect(text).toContain('cx="10"');
  });

  it('resolves css variables to computed values', async () => {
    const container = makeContainer(
      '<svg xmlns="http://www.w3.org/2000/svg"><rect fill="var(--my-color)" /></svg>',
    );
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      getPropertyValue: (prop: string) => (prop === '--my-color' ? '#ff0000' : ''),
      color: 'rgb(0,0,0)',
    } as unknown as CSSStyleDeclaration);

    const blob = toSvgBlob(container)!;
    const text = await readBlob(blob);
    expect(text).toContain('#ff0000');
    expect(text).not.toContain('var(--my-color)');
  });

  it('uses the fallback when css variable is not defined', async () => {
    const container = makeContainer(
      '<svg xmlns="http://www.w3.org/2000/svg"><rect fill="var(--missing, blue)" /></svg>',
    );
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      getPropertyValue: () => '',
      color: 'rgb(0,0,0)',
    } as unknown as CSSStyleDeclaration);

    const blob = toSvgBlob(container)!;
    const text = await readBlob(blob);
    expect(text).toContain('blue');
    expect(text).not.toContain('var(--missing');
  });

  it('replaces currentColor with the computed color', async () => {
    const container = makeContainer(
      '<svg xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" /></svg>',
    );
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      getPropertyValue: () => '',
      color: 'rgb(255, 0, 0)',
    } as unknown as CSSStyleDeclaration);

    const blob = toSvgBlob(container)!;
    const text = await readBlob(blob);
    expect(text).toContain('rgb(255, 0, 0)');
    expect(text).not.toContain('currentColor');
  });

  it('resolves multiple variables and currentColor in one svg', async () => {
    const container = makeContainer(`
      <svg xmlns="http://www.w3.org/2000/svg">
        <rect fill="var(--bg)" />
        <path fill="currentColor" />
      </svg>
    `);
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      getPropertyValue: (prop: string) => (prop === '--bg' ? '#ffffff' : ''),
      color: 'rgb(0, 0, 0)',
    } as unknown as CSSStyleDeclaration);

    const blob = toSvgBlob(container)!;
    const text = await readBlob(blob);
    expect(text).toContain('#ffffff');
    expect(text).toContain('rgb(0, 0, 0)');
    expect(text).not.toContain('var(--bg)');
    expect(text).not.toContain('currentColor');
  });

  it('resolves nested css variables in fallback values', async () => {
    const container = makeContainer(
      '<svg xmlns="http://www.w3.org/2000/svg"><rect fill="var(--a, var(--b, red))" /></svg>',
    );
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      getPropertyValue: (prop: string) => (prop === '--b' ? 'green' : ''),
      color: 'rgb(0,0,0)',
    } as unknown as CSSStyleDeclaration);

    const blob = toSvgBlob(container)!;
    const text = await readBlob(blob);
    expect(text).toContain('green');
    expect(text).not.toContain('var(');
  });
});
