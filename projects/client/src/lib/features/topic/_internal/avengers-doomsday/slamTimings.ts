import { LETTER_STAGGER } from './LETTER_STAGGER.ts';

const LETTER_DROP = 300;
const IMPACT_LETTERS = 18;

export function slamTimings(text: string) {
  const letterCount = [...text.replace(/\s+/g, '')].length;

  return {
    impactAt:
      Math.min(letterCount, IMPACT_LETTERS) * LETTER_STAGGER +
      LETTER_DROP * 0.7,
    endAt: letterCount * LETTER_STAGGER + LETTER_DROP + 500,
  };
}
