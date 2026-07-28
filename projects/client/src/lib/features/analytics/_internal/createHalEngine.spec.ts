import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AnalyticsEvent } from '../events/AnalyticsEvent.ts';
import { createHalEngine } from './createHalEngine.ts';

const ENDPOINT = 'https://hal.test/e';

function setup() {
  const send = vi.fn();
  const engine = createHalEngine({ endpoint: ENDPOINT, send });
  return { engine, send };
}

describe('store: createHalEngine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should buffer events until the flush delay elapses', () => {
    const { engine, send } = setup();

    engine.record(AnalyticsEvent.Rate, { rating: 8 });
    expect(send).not.toHaveBeenCalled();

    vi.runOnlyPendingTimers();

    expect(send).toHaveBeenCalledTimes(1);
    const [endpoint, batch] = send.mock.calls[0];
    expect(endpoint).toBe(ENDPOINT);
    expect(batch).toMatchObject([
      {
        event: AnalyticsEvent.Rate,
        dims: {},
        metrics: { rating: 8 },
      },
    ]);
  });

  it('should drop an event name absent from the allowlist', () => {
    const { engine, send } = setup();

    engine.record('not-a-real-event', { source: 'somewhere' });
    vi.runOnlyPendingTimers();

    expect(send).not.toHaveBeenCalled();
  });

  it('should flush immediately once the batch cap is reached', () => {
    const { engine, send } = setup();

    for (let index = 0; index < 50; index++) {
      engine.record(AnalyticsEvent.Watchlist, { action: 'add' });
    }

    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0][1]).toHaveLength(50);
  });

  it('should chunk a flush of more than the batch cap', () => {
    const { engine, send } = setup();

    for (let index = 0; index < 51; index++) {
      engine.record(AnalyticsEvent.Watchlist, { action: 'add' });
    }
    vi.runOnlyPendingTimers();

    expect(send).toHaveBeenCalledTimes(2);
    expect(send.mock.calls[0][1]).toHaveLength(50);
    expect(send.mock.calls[1][1]).toHaveLength(1);
  });

  it('should flush on page teardown', () => {
    const { engine, send } = setup();

    engine.record(AnalyticsEvent.Theme, { theme: 'dark' });
    window.dispatchEvent(new Event('pagehide'));

    expect(send).toHaveBeenCalledTimes(1);
  });

  it('should never emit a user identifier', () => {
    const { engine, send } = setup();

    engine.record(AnalyticsEvent.Rate, { rating: 8, user_type: 'vip' });
    vi.runOnlyPendingTimers();

    const serialized = JSON.stringify(send.mock.calls[0][1]);
    expect(serialized).not.toContain('userId');
    expect(serialized).not.toContain('user_joined_at');
    expect(serialized).toContain('vip');
  });
});
