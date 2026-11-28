import { describe, expect, it } from 'vitest';
import { lockupMarkup } from './lockupMarkup.ts';

const word = (world: string, text: string) =>
  `<span class="dd-lockup-word" data-world="${world}">${text}</span>`;

describe('util: lockupMarkup', () => {
  it('should split a multi word title into a dune lead and a doom last word', () => {
    expect(lockupMarkup('Dune Part Three')).toBe(
      `${word('dune', 'Dune Part')}<i class="dd-lockup-gem"></i>${word('doom', 'Three')}`,
    );
  });

  it('should keep a title with a digit as one dune word', () => {
    expect(lockupMarkup('Part 2')).toBe(word('dune', 'Part 2'));
  });

  it('should pick the world of a single word title by the hash parity', () => {
    expect(lockupMarkup('Dune')).toBe(word('doom', 'Dune'));
    expect(lockupMarkup('Silo')).toBe(word('dune', 'Silo'));
  });

  it('should collapse extra whitespace', () => {
    expect(lockupMarkup('  Dune   Part  Three ')).toBe(
      lockupMarkup('Dune Part Three'),
    );
  });

  it('should escape markup in the words', () => {
    expect(lockupMarkup('A <b> C')).toBe(
      `${word('dune', 'A &lt;b&gt;')}<i class="dd-lockup-gem"></i>${word('doom', 'C')}`,
    );
  });

  it('should fall back to a doom word for an empty title', () => {
    expect(lockupMarkup('')).toBe(word('doom', ''));
  });
});
