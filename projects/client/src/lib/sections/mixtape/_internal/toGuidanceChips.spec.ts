import { describe, expect, it } from 'vitest';
import { toGuidanceChips } from './toGuidanceChips.ts';

const category = (key: string, severityTone: string) => ({ key, severityTone });

describe('toGuidanceChips', () => {
  it('should keep only the flagged categories, worst first', () => {
    const { flagged, isReported } = toGuidanceChips([
      category('NUDITY', 'mild'),
      category('VIOLENCE', 'severe'),
      category('PROFANITY', 'none'),
      category('ALCOHOL', 'moderate'),
      category('FRIGHTENING', 'unknown'),
    ]);

    expect(flagged.map((item) => item.key)).toEqual([
      'VIOLENCE',
      'ALCOHOL',
      'NUDITY',
    ]);
    expect(isReported).toBe(true);
  });

  it('should keep the declared order between equal severities', () => {
    const { flagged } = toGuidanceChips([
      category('NUDITY', 'severe'),
      category('VIOLENCE', 'severe'),
    ]);

    expect(flagged.map((item) => item.key)).toEqual(['NUDITY', 'VIOLENCE']);
  });

  it('should report a guide where nothing is flagged', () => {
    const { flagged, isReported } = toGuidanceChips([
      category('NUDITY', 'none'),
      category('VIOLENCE', 'unknown'),
    ]);

    expect(flagged).toEqual([]);
    expect(isReported).toBe(true);
  });

  it('should not report a missing guide', () => {
    const { flagged, isReported } = toGuidanceChips([
      category('NUDITY', 'unknown'),
      category('VIOLENCE', 'unknown'),
    ]);

    expect(flagged).toEqual([]);
    expect(isReported).toBe(false);
  });
});
