import { concat, ignoreElements, type Observable, of, timer } from 'rxjs';
import type { toTypingFrames } from './toTypingFrames.ts';

type TypingFrames = ReturnType<typeof toTypingFrames>;

export function typeLines(
  frames: TypingFrames,
): Observable<ReadonlyArray<string>> {
  return concat(
    ...frames.map(({ typed, wait }) =>
      concat(of(typed), timer(wait).pipe(ignoreElements())),
    ),
  );
}
