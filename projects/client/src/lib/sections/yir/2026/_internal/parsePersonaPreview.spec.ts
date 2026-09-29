import { describe, expect, it } from 'vitest';
import { parsePersonaPreview } from './parsePersonaPreview.ts';

const parse = (query: string) =>
  parsePersonaPreview(new URLSearchParams(query));

describe('util: parsePersonaPreview', () => {
  it('should return undefined without a persona', () => {
    expect(parse('')).toBeUndefined();
  });

  it('should return undefined for an unknown persona', () => {
    expect(parse('persona=movie-buff')).toBeUndefined();
  });

  it('should leave the runner-up to the default when not given', () => {
    expect(parse('persona=critic')).toEqual({ persona: 'critic' });
  });

  it('should disable the hybrid when runner is none', () => {
    expect(parse('persona=critic&runner=none')).toEqual({
      persona: 'critic',
      runnerUp: null,
    });
  });

  it('should accept a valid runner-up', () => {
    expect(parse('persona=critic&runner=cinephile')).toEqual({
      persona: 'critic',
      runnerUp: 'cinephile',
    });
  });

  it('should ignore an unknown runner-up', () => {
    expect(parse('persona=critic&runner=nope')).toEqual({
      persona: 'critic',
      runnerUp: undefined,
    });
  });
});
