import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type TrackSelectorParams, trackSelector } from './trackSelector.ts';

type Box = { left: number; width: number };

const place = (element: HTMLElement, box: Box) => {
  element.getBoundingClientRect = () =>
    ({ left: box.left, width: box.width }) as DOMRect;
};

function setup(overrides: Partial<TrackSelectorParams> = {}) {
  const row = document.createElement('div');
  const selector = document.createElement('div');
  const target = document.createElement('div');
  const next = document.createElement('div');
  row.append(selector, target, next);
  document.body.append(row);

  place(row, { left: 10, width: 300 });
  place(selector, { left: 10, width: 40 });
  place(target, { left: 110, width: 60 });
  place(next, { left: 260, width: 100 });

  const params: TrackSelectorParams = {
    isFluid: true,
    shouldMorph: true,
    isClipped: false,
    isReducedMotion: false,
    selector,
    target,
    ...overrides,
  };

  return { row, selector, target, next, params };
}

const x = (element: HTMLElement) =>
  element.style.getPropertyValue('--selector-x');
const w = (element: HTMLElement) =>
  element.style.getPropertyValue('--selector-w');

describe('util: trackSelector', () => {
  let now = 0;
  let frames: Array<FrameRequestCallback | null> = [];

  const runFrame = (at: number) => {
    now = at;
    const pending = frames;
    frames = [];
    pending.forEach((callback) => callback?.(at));
  };

  beforeEach(() => {
    now = 0;
    frames = [];
    vi.spyOn(performance, 'now').mockImplementation(() => now);
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.push(callback);
      return frames.length;
    });
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      },
    );
    vi.stubGlobal('cancelAnimationFrame', (id: number) => {
      frames[id - 1] = null;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
  });

  it('should place the selector over the target relative to the row', () => {
    const { row, selector, params } = setup();

    trackSelector(row, params);

    expect(x(selector)).toBe('100px');
    expect(w(selector)).toBe('60px');
    expect(row.dataset.measured).toBe('');
  });

  it('should mark the row as settled on the next frame', () => {
    const { row, params } = setup();

    trackSelector(row, params);
    expect(row.dataset.settled).toBeUndefined();

    runFrame(16);

    expect(row.dataset.settled).toBe('');
  });

  it('should not touch the row when it is not fluid', () => {
    const { row, selector, params } = setup({ isFluid: false });

    trackSelector(row, params);

    expect(x(selector)).toBe('');
    expect(row.dataset.measured).toBeUndefined();
  });

  it('should start tracking once it becomes fluid', () => {
    const { row, selector, params } = setup({ isFluid: false });
    const action = trackSelector(row, params);

    action.update({ ...params, isFluid: true });

    expect(x(selector)).toBe('100px');
  });

  it('should skip measuring a row that is detached', () => {
    const { row, selector, params } = setup();
    row.remove();

    trackSelector(row, params);

    expect(x(selector)).toBe('');
  });

  it('should re-measure when the params change without a new target', () => {
    const { row, selector, params } = setup();
    const action = trackSelector(row, params);
    place(params.target as HTMLElement, { left: 150, width: 70 });

    action.update(params);

    expect(x(selector)).toBe('140px');
    expect(w(selector)).toBe('70px');
  });

  describe('when the target changes', () => {
    it('should morph to the new target and then settle on it', () => {
      const { row, selector, next, params } = setup();
      const action = trackSelector(row, params);
      runFrame(1);

      action.update({ ...params, target: next });
      expect(row.dataset.tracking).toBe('');

      runFrame(100);
      expect(row.dataset.tracking).toBe('');

      runFrame(1000);

      expect(row.dataset.tracking).toBeUndefined();
      expect(x(selector)).toBe('250px');
      expect(w(selector)).toBe('100px');
    });

    it('should jump straight to the target with reduced motion', () => {
      const { row, selector, next, params } = setup({ isReducedMotion: true });
      const action = trackSelector(row, params);

      action.update({ ...params, target: next });

      expect(row.dataset.tracking).toBeUndefined();
      expect(x(selector)).toBe('250px');
    });

    it('should measure instead of morphing when morphing is off', () => {
      const { row, selector, next, params } = setup({ shouldMorph: false });
      const action = trackSelector(row, params);

      action.update({ ...params, target: next });

      expect(row.dataset.tracking).toBeUndefined();
      expect(x(selector)).toBe('250px');
    });

    it('should keep a clipped selector inside the row while morphing', () => {
      const { row, selector, next, params } = setup({ isClipped: true });
      const action = trackSelector(row, params);

      action.update({ ...params, target: next });
      runFrame(300);

      const end = parseFloat(x(selector)) + parseFloat(w(selector));
      expect(end).toBeLessThanOrEqual(300);
      expect(parseFloat(x(selector))).toBeGreaterThanOrEqual(0);
    });

    it('should let an unclipped selector overshoot the row while morphing', () => {
      const { row, selector, next, params } = setup({ isClipped: false });
      const action = trackSelector(row, params);

      action.update({ ...params, target: next });
      runFrame(300);

      const end = parseFloat(x(selector)) + parseFloat(w(selector));
      expect(end).toBeGreaterThan(300);
    });

    it('should not measure mid morph', () => {
      const { row, selector, next, params } = setup();
      const action = trackSelector(row, params);
      action.update({ ...params, target: next });
      runFrame(100);
      const midMorph = x(selector);

      action.update({ ...params, target: next, shouldMorph: false });

      expect(x(selector)).toBe(midMorph);
    });
  });

  it('should stop morphing when it stops being fluid', () => {
    const { row, next, params } = setup();
    const action = trackSelector(row, params);
    action.update({ ...params, target: next });

    action.update({ ...params, target: next, isFluid: false });

    expect(row.dataset.tracking).toBeUndefined();
  });

  it('should stop morphing and cancel pending frames when destroyed', () => {
    const { row, selector, next, params } = setup();
    const action = trackSelector(row, params);
    action.update({ ...params, target: next });

    action.destroy();
    runFrame(1000);

    expect(row.dataset.tracking).toBeUndefined();
    expect(row.dataset.settled).toBeUndefined();
    expect(x(selector)).toBe('100px');
  });
});
