import { beforeEach, describe, expect, it } from 'vitest';
import { appendClassList } from './appendClassList.ts';

describe('appendClassList', () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement('div');
  });

  it('should add a single class', () => {
    appendClassList(element, 'test-class');
    expect(element.classList.contains('test-class')).toBe(true);
  });

  it('should add multiple space-separated classes', () => {
    appendClassList(element, 'class1 class2 class3');
    expect(element.classList.contains('class1')).toBe(true);
    expect(element.classList.contains('class2')).toBe(true);
    expect(element.classList.contains('class3')).toBe(true);
  });

  it('should handle empty string', () => {
    appendClassList(element, '');
    expect(element.classList.length).toBe(0);
  });

  it('should handle multiple spaces between classes', () => {
    appendClassList(element, 'class1    class2');
    expect(element.classList.contains('class1')).toBe(true);
    expect(element.classList.contains('class2')).toBe(true);
  });
});
