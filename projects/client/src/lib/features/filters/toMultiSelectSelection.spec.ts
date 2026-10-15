import { describe, expect, it } from 'vitest';
import { toMultiSelectSelection } from './toMultiSelectSelection.ts';

describe('util: toMultiSelectSelection', () => {
  it('should return empty groups for a nullish value', () => {
    expect(toMultiSelectSelection(null)).toEqual({
      included: [],
      excluded: [],
    });
    expect(toMultiSelectSelection(undefined)).toEqual({
      included: [],
      excluded: [],
    });
    expect(toMultiSelectSelection('')).toEqual({ included: [], excluded: [] });
  });

  it('should treat unprefixed tokens as included', () => {
    expect(toMultiSelectSelection('action,drama')).toEqual({
      included: ['action', 'drama'],
      excluded: [],
    });
  });

  it('should treat prefixed tokens as excluded and strip the prefix', () => {
    expect(toMultiSelectSelection('action,-comedy,-horror')).toEqual({
      included: ['action'],
      excluded: ['comedy', 'horror'],
    });
  });

  it('should preserve hyphens inside a value once the prefix is stripped', () => {
    expect(toMultiSelectSelection('-pg-13')).toEqual({
      included: [],
      excluded: ['pg-13'],
    });
  });

  it('should drop repeated values', () => {
    expect(toMultiSelectSelection('action,action,-comedy,-comedy')).toEqual({
      included: ['action'],
      excluded: ['comedy'],
    });
  });

  it('should keep the first state of a value that is both included and excluded', () => {
    expect(toMultiSelectSelection('action,-action,-drama,drama')).toEqual({
      included: ['action'],
      excluded: ['drama'],
    });
  });
});
