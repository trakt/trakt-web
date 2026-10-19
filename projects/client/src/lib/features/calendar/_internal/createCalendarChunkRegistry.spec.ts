import {
  asapScheduler,
  BehaviorSubject,
  combineLatest,
  firstValueFrom,
  map,
  observeOn,
} from 'rxjs';
import { describe, expect, it } from 'vitest';
import { createCalendarChunkRegistry } from './createCalendarChunkRegistry.ts';

const createResult = () => ({
  isLoading: new BehaviorSubject(true),
  calendar: new BehaviorSubject([{ date: new Date(2026, 9, 18), items: [] }]),
  hasUpstreamItems: new BehaviorSubject(false),
});

describe('util: createCalendarChunkRegistry', () => {
  it('should expose the latest state of every registered chunk', async () => {
    const registry = createCalendarChunkRegistry<never>();
    const result = createResult();

    registry.register('a', result);
    result.isLoading.next(false);

    const states = await firstValueFrom(registry.states);
    expect(states.get('a')?.isLoading).toBe(false);
    expect(states.get('a')?.calendar).toHaveLength(1);
  });

  it('should keep a loaded chunk loaded while it refetches', async () => {
    const registry = createCalendarChunkRegistry<never>();
    const result = createResult();

    registry.register('a', result);
    result.isLoading.next(false);
    await firstValueFrom(registry.states);
    result.isLoading.next(true);

    const states = await firstValueFrom(registry.states);
    expect(states.get('a')?.isLoading).toBe(false);
    expect(states.get('a')?.calendar).toHaveLength(1);
  });

  it('should wait for a deferred loading flag before it counts as loaded', async () => {
    const registry = createCalendarChunkRegistry<never>();
    const base = new BehaviorSubject(true);
    const overlay = new BehaviorSubject(false);
    const result = {
      ...createResult(),
      isLoading: combineLatest([
        base,
        overlay.pipe(observeOn(asapScheduler)),
      ]).pipe(map(([isBase, isOverlay]) => isBase || isOverlay)),
    };

    registry.register('a', result);
    base.next(false);
    overlay.next(true);
    await new Promise((resolve) => setTimeout(resolve));

    expect((await firstValueFrom(registry.states)).get('a')?.isLoading).toBe(
      true,
    );
  });

  it('should drop a chunk once it unregisters', async () => {
    const registry = createCalendarChunkRegistry<never>();
    const unregister = registry.register('a', createResult());
    registry.register('b', createResult());

    unregister();

    const states = await firstValueFrom(registry.states);
    expect([...states.keys()]).toEqual(['b']);
  });
});
