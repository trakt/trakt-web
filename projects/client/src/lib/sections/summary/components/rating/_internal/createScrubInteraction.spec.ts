import { TestScheduler } from 'rxjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { createScrubInteraction } from './createScrubInteraction.ts';

const pointerAt = (clientX: number) => ({ clientX } as PointerEvent);

describe('util: createScrubInteraction', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  describe('commit$', () => {
    it('should pair a pointerdown with the pointerup that ends it', () => {
      scheduler.run(({ cold, expectObservable }) => {
        const down = pointerAt(10);
        const up = pointerAt(30);

        const { commit$ } = createScrubInteraction({
          down$: cold('(a|)', { a: down }),
          up$: cold('--b', { b: up }),
          cancel$: cold('-'),
          move$: cold('-'),
          leave$: cold('-'),
        });

        expectObservable(commit$).toBe('--(c|)', { c: { down, up } });
      });
    });

    it('should abort without committing when a pointercancel arrives first', () => {
      scheduler.run(({ cold, expectObservable }) => {
        const { commit$ } = createScrubInteraction({
          down$: cold('(a|)', { a: pointerAt(10) }),
          up$: cold('----b', { b: pointerAt(30) }),
          cancel$: cold('--c', { c: pointerAt(0) }),
          move$: cold('-'),
          leave$: cold('-'),
        });

        expectObservable(commit$).toBe('--|');
      });
    });

    it('should commit only the first pointerup of a gesture', () => {
      scheduler.run(({ cold, expectObservable }) => {
        const down = pointerAt(10);
        const up = pointerAt(30);

        const { commit$ } = createScrubInteraction({
          down$: cold('(a|)', { a: down }),
          up$: cold('--b--d', { b: up, d: pointerAt(40) }),
          cancel$: cold('-'),
          move$: cold('-'),
          leave$: cold('-'),
        });

        expectObservable(commit$).toBe('--(c|)', { c: { down, up } });
      });
    });
  });

  describe('preview$', () => {
    it('should emit the pointer clientX on move', () => {
      scheduler.run(({ cold, expectObservable }) => {
        const { preview$ } = createScrubInteraction({
          down$: cold('-'),
          up$: cold('-'),
          cancel$: cold('-'),
          move$: cold('a-b', { a: pointerAt(5), b: pointerAt(9) }),
          leave$: cold('-'),
        });

        expectObservable(preview$).toBe('x-y', { x: 5, y: 9 });
      });
    });

    it('should emit null when the pointer leaves or the gesture cancels', () => {
      scheduler.run(({ cold, expectObservable }) => {
        const { preview$ } = createScrubInteraction({
          down$: cold('-'),
          up$: cold('-'),
          cancel$: cold('---c', { c: pointerAt(0) }),
          move$: cold('a', { a: pointerAt(5) }),
          leave$: cold('-l', { l: pointerAt(0) }),
        });

        expectObservable(preview$).toBe('xy-z', { x: 5, y: null, z: null });
      });
    });
  });
});
