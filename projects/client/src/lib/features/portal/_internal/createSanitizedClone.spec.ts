import { describe, expect, it } from 'vitest';
import { createSanitizedClone } from './createSanitizedClone.ts';

describe('createSanitizedClone', () => {
  it('should create a clone of the target element', () => {
    const target = document.createElement('div');
    const content = document.createElement('p');
    content.textContent = 'Hello, world!';
    target.appendChild(content);

    const clone = createSanitizedClone(target);

    expect(clone).not.toBe(target);
    expect(clone.outerHTML).toBe(target.outerHTML);
  });

  it('should remove defs elements from SVGs', () => {
    const target = document.createElement('div');
    const svg = document.createElement('svg');
    const defs = document.createElement('defs');
    const gradient = document.createElement('linearGradient');
    gradient.setAttribute('id', 'gradient');
    defs.appendChild(gradient);
    svg.appendChild(defs);
    target.appendChild(svg);

    const clone = createSanitizedClone(target);

    const svgInOriginal = target.querySelector('svg');
    const defsInOriginal = svgInOriginal?.querySelector('defs');
    expect(defsInOriginal).not.toBeNull();

    const svgInClone = clone.querySelector('svg');
    const defsInClone = svgInClone?.querySelector('defs');
    expect(defsInClone).toBeNull();
  });
});
