import { describe, expect, it } from 'vitest';
import { YirPersonaIdSchema } from '../models/YirPersonaId.ts';
import { YirPersonaResultSchema } from '../models/YirPersonaResult.ts';
import { dummyYirPersonaResult } from './dummyYirPersonaResult.ts';

describe('util: dummyYirPersonaResult', () => {
  it.each(YirPersonaIdSchema.options)(
    'should produce a valid result for %s',
    (persona) => {
      const result = dummyYirPersonaResult({ persona });

      expect(YirPersonaResultSchema.safeParse(result).success).toBe(true);
    },
  );

  it('should use the fixture runner-up by default', () => {
    expect(dummyYirPersonaResult({ persona: 'critic' }).runnerUp).toBe(
      'cinephile',
    );
  });

  it('should drop the hybrid when the runner-up is null', () => {
    const result = dummyYirPersonaResult({ persona: 'critic', runnerUp: null });

    expect(result.runnerUp).toBeNull();
    expect(result.runnerUpHighlights).toEqual([]);
  });

  it('should give the wildcard a different persona every month', () => {
    const monthly = dummyYirPersonaResult({ persona: 'wildcard' }).monthly;

    expect(new Set(monthly.map((entry) => entry.persona)).size).toBe(
      monthly.length,
    );
  });
});
