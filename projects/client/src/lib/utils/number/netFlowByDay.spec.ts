import { describe, expect, it } from 'vitest';
import { netFlowByDay } from './netFlowByDay.ts';

describe('util: netFlowByDay', () => {
  it('should compute net as added minus removed', () => {
    expect(
      netFlowByDay([{ day: '2026-01-01', added: 5, removed: 2 }]),
    ).toEqual([{ day: '2026-01-01', net: 3 }]);
  });

  it('should merge entries sharing a day', () => {
    expect(
      netFlowByDay([
        { day: '2026-01-01', added: 5, removed: 0 },
        { day: '2026-01-01', added: 0, removed: 3 },
      ]),
    ).toEqual([{ day: '2026-01-01', net: 2 }]);
  });

  it('should sort ascending by day regardless of input order', () => {
    expect(
      netFlowByDay([
        { day: '2026-01-03', added: 1, removed: 0 },
        { day: '2026-01-01', added: 2, removed: 0 },
        { day: '2026-01-02', added: 3, removed: 0 },
      ]),
    ).toEqual([
      { day: '2026-01-01', net: 2 },
      { day: '2026-01-02', net: 3 },
      { day: '2026-01-03', net: 1 },
    ]);
  });

  it('should yield negative net when removals dominate', () => {
    expect(
      netFlowByDay([{ day: '2026-01-01', added: 1, removed: 4 }]),
    ).toEqual([{ day: '2026-01-01', net: -3 }]);
  });

  it('should return an empty array for no entries', () => {
    expect(netFlowByDay([])).toEqual([]);
  });
});
