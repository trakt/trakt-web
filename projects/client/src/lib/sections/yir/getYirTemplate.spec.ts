import { describe, expect, it } from 'vitest';
import { getYirTemplate } from './getYirTemplate.ts';
import Yir2024 from './2024/Yir2024.svelte';
import YirDefault from './default/YirDefault.svelte';

describe('getYirTemplate', () => {
  it('returns Yir2024 for year 2024', () => {
    expect(getYirTemplate(2024)).toBe(Yir2024);
  });

  it('returns YirDefault for years other than 2024', () => {
    expect(getYirTemplate(2023)).toBe(YirDefault);
    expect(getYirTemplate(2025)).toBe(YirDefault);
    expect(getYirTemplate(1999)).toBe(YirDefault);
  });
});
