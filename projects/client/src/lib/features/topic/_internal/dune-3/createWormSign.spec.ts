import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createWormSign } from './createWormSign.ts';

const BEAT = 300;

describe('util: createWormSign', () => {
  const clock = { now: 1000 };

  const scroll = (beats: number) =>
    Array.from({ length: beats }).forEach(() => {
      clock.now += BEAT;
      window.dispatchEvent(new Event('wheel'));
    });

  beforeEach(() => {
    clock.now = 1000;
    vi.spyOn(performance, 'now').mockImplementation(() => clock.now);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should start calm', () => {
    const sign = createWormSign();

    expect(sign.read(clock.now)).toEqual({
      level: 0,
      wormAt: -Infinity,
      stage: 'calm',
    });
  });

  it('should ignore input until started', () => {
    const sign = createWormSign();

    scroll(8);

    expect(sign.read(clock.now).level).toBe(0);
  });

  it('should stay calm while the rhythm is still warming up', () => {
    const sign = createWormSign();
    sign.start();

    scroll(3);

    expect(sign.read(clock.now).stage).toBe('calm');
    sign.stop();
  });

  it('should stir once a steady rhythm builds the level past 0.3', () => {
    const sign = createWormSign();
    sign.start();

    scroll(5);
    const reading = sign.read(clock.now);

    expect(reading.level).toBeGreaterThanOrEqual(0.3);
    expect(reading.level).toBeLessThan(0.6);
    expect(reading.stage).toBe('stir');
    sign.stop();
  });

  it('should tremor once the level passes 0.6', () => {
    const sign = createWormSign();
    sign.start();

    scroll(7);
    const reading = sign.read(clock.now);

    expect(reading.level).toBeGreaterThanOrEqual(0.6);
    expect(reading.level).toBeLessThan(1);
    expect(reading.stage).toBe('tremor');
    sign.stop();
  });

  it('should summon the worm when the level tops out', () => {
    const sign = createWormSign();
    sign.start();

    scroll(9);
    const reading = sign.read(clock.now);

    expect(reading.stage).toBe('worm');
    expect(reading.wormAt).toBe(clock.now);
    expect(reading.level).toBe(0.5);
    sign.stop();
  });

  it('should leave the worm stage after the passage', () => {
    const sign = createWormSign();
    sign.start();

    scroll(9);
    const { wormAt } = sign.read(clock.now);

    expect(sign.read(wormAt + 7400).stage).toBe('worm');
    expect(sign.read(wormAt + 7500).stage).not.toBe('worm');
    sign.stop();
  });

  it('should decay the level once input goes idle', () => {
    const sign = createWormSign();
    sign.start();

    scroll(5);
    const before = sign.read(clock.now).level;
    const after = sign.read(clock.now + 5000).level;

    expect(after).toBeLessThan(before);
    sign.stop();
  });

  it('should ignore non scroll keys and repeated keys', () => {
    const sign = createWormSign();
    sign.start();

    Array.from({ length: 8 }).forEach(() => {
      clock.now += BEAT;
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', repeat: true }),
      );
    });

    expect(sign.read(clock.now).level).toBe(0);
    sign.stop();
  });

  it('should count scroll keys as input', () => {
    const sign = createWormSign();
    sign.start();

    Array.from({ length: 5 }).forEach(() => {
      clock.now += BEAT;
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    });

    expect(sign.read(clock.now).stage).toBe('stir');
    sign.stop();
  });

  it('should stop listening after stop', () => {
    const sign = createWormSign();
    sign.start();
    sign.stop();

    scroll(8);

    expect(sign.read(clock.now).level).toBe(0);
  });
});
