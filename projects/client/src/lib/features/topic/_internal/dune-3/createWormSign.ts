import type { WormSign } from './WormSign.ts';
import type { WormStage } from './WormStage.ts';

const BEAT_GAP = 140;
const SPAN_LIMIT = 2200;
const MEMORY = 5;
const FRANTIC = 150;
const STEADY = 0.2;
const RESTLESS = 0.38;
const RISE = 0.17;
const CALM = 0.22;
const DECAY = 0.06;
const IDLE = 1500;
const COOLDOWN = 9000;
const PASSAGE = 7500;
const SCROLL_KEYS = new Set([
  'ArrowDown',
  'ArrowUp',
  'PageDown',
  'PageUp',
  ' ',
  'j',
  'k',
]);

const clamp = (value: number) => Math.min(1, Math.max(0, value));

const spread = (intervals: ReadonlyArray<number>) => {
  const mean =
    intervals.reduce((sum, value) => sum + value, 0) / intervals.length;
  const variance =
    intervals.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
    intervals.length;
  return { mean, variation: Math.sqrt(variance) / mean };
};

const stageOf = (level: number, wormAt: number, now: number): WormStage => {
  if (now - wormAt < PASSAGE) return 'worm';
  if (level >= 0.6) return 'tremor';
  if (level >= 0.3) return 'stir';
  return 'calm';
};

export function createWormSign(): WormSign {
  const state = {
    level: 0,
    lastInput: -Infinity,
    lastBeat: -Infinity,
    lastRead: performance.now(),
    wormAt: -Infinity,
    intervals: [] as number[],
  };

  const summon = (now: number) => {
    state.wormAt = now;
    state.level = 0.5;
    state.intervals = [];
  };

  const adjust = (delta: number, now: number) => {
    const cooling = now - state.wormAt < COOLDOWN;
    state.level = Math.min(cooling ? 0.92 : 1, clamp(state.level + delta));
    if (state.level >= 1) summon(now);
  };

  const beat = (now: number) => {
    const interval = now - state.lastBeat;
    state.lastBeat = now;

    if (interval > SPAN_LIMIT) {
      state.intervals = [];
      return;
    }

    state.intervals = [...state.intervals, interval].slice(-MEMORY);
    if (state.intervals.length < 3) return adjust(0.03, now);

    const { mean, variation } = spread(state.intervals);
    if (mean < FRANTIC) return adjust(-CALM * 0.5, now);
    if (variation < STEADY) return adjust(RISE * (1 - variation), now);
    if (variation > RESTLESS) return adjust(-CALM, now);
  };

  const input = () => {
    const now = performance.now();
    const quiet = now - state.lastInput;
    state.lastInput = now;
    if (quiet > BEAT_GAP) beat(now);
  };

  const onKey = (event: KeyboardEvent) => {
    if (event.repeat || !SCROLL_KEYS.has(event.key)) return;
    input();
  };

  const read: WormSign['read'] = (now) => {
    const elapsed = Math.max(0, now - state.lastRead) / 1000;
    state.lastRead = now;
    if (now - state.lastBeat > IDLE)
      state.level = clamp(state.level - elapsed * DECAY);

    return {
      level: state.level,
      wormAt: state.wormAt,
      stage: stageOf(state.level, state.wormAt, now),
    };
  };

  return {
    read,
    start: () => {
      window.addEventListener('wheel', input, { passive: true });
      window.addEventListener('touchstart', input, { passive: true });
      window.addEventListener('keydown', onKey);
    },
    stop: () => {
      window.removeEventListener('wheel', input);
      window.removeEventListener('touchstart', input);
      window.removeEventListener('keydown', onKey);
    },
  };
}
