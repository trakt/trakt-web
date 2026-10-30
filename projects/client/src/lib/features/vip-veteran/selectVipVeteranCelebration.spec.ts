import type { VipVeteran } from '$lib/requests/models/VipVeteran.ts';
import { describe, expect, it } from 'vitest';
import { selectVipVeteranCelebration } from './selectVipVeteranCelebration.ts';
import type { VipVeteranMemory } from './VipVeteranMemory.ts';

const SINCE = new Date('2016-03-12T18:00:00Z');
const ANNIVERSARY = new Date('2026-03-12T09:00:00Z');
const ORDINARY_DAY = new Date('2026-06-01T09:00:00Z');

const legend: VipVeteran = {
  since: SINCE,
  years: 10,
  tier: 10,
  title: 'legend',
};

const remembered = (
  overrides: Partial<VipVeteranMemory> = {},
): VipVeteranMemory => ({
  title: 'veteran',
  anniversaryYear: null,
  graceShownOn: null,
  ...overrides,
});

describe('util: selectVipVeteranCelebration', () => {
  it('should seed the title silently on first sight', () => {
    const result = selectVipVeteranCelebration({
      veteran: legend,
      memory: null,
      today: ORDINARY_DAY,
    });

    expect(result.celebration).to.equal(null);
    expect(result.memory.title).to.equal('legend');
  });

  it('should celebrate a promotion once', () => {
    const first = selectVipVeteranCelebration({
      veteran: legend,
      memory: remembered(),
      today: ORDINARY_DAY,
    });
    const second = selectVipVeteranCelebration({
      veteran: legend,
      memory: first.memory,
      today: ORDINARY_DAY,
    });

    expect(first.celebration).to.deep.equal({
      kind: 'promotion',
      from: 'veteran',
    });
    expect(second.celebration).to.equal(null);
  });

  it('should celebrate the anniversary once a year', () => {
    const first = selectVipVeteranCelebration({
      veteran: legend,
      memory: remembered({ title: 'legend' }),
      today: ANNIVERSARY,
    });
    const second = selectVipVeteranCelebration({
      veteran: legend,
      memory: first.memory,
      today: ANNIVERSARY,
    });

    expect(first.celebration).to.deep.equal({ kind: 'anniversary' });
    expect(first.memory.anniversaryYear).to.equal(2026);
    expect(second.celebration).to.equal(null);
  });

  it('should let the promotion win on the anniversary', () => {
    const result = selectVipVeteranCelebration({
      veteran: legend,
      memory: remembered(),
      today: ANNIVERSARY,
    });

    expect(result.celebration?.kind).to.equal('promotion');
    expect(result.memory.anniversaryYear).to.equal(2026);
  });

  it('should keep the highest title after a reset', () => {
    const result = selectVipVeteranCelebration({
      veteran: { ...legend, years: 1, tier: 1, title: null },
      memory: remembered({ title: 'legend' }),
      today: ORDINARY_DAY,
    });

    expect(result.celebration).to.equal(null);
    expect(result.memory.title).to.equal('legend');
  });

  it('should skip the anniversary before the first full year', () => {
    const result = selectVipVeteranCelebration({
      veteran: { ...legend, years: 0, tier: 1, title: null },
      memory: remembered({ title: null }),
      today: ANNIVERSARY,
    });

    expect(result.celebration).to.equal(null);
  });
});
