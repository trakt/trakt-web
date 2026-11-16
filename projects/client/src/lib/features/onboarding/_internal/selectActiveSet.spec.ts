import { ExtendedUserMappedMock } from '$mocks/data/users/mapped/ExtendedUserSettingsMappedMock.ts';
import { buildOnboardingSet } from '$test/beds/onboarding/buildOnboardingSet.ts';
import { describe, expect, it } from 'vitest';
import { importedAny } from './rules/importedAny.ts';
import { selectActiveSet } from './selectActiveSet.ts';

const NOW = 1_000_000;

const first = buildOnboardingSet({
  id: 'first',
  retireWhen: importedAny({ threshold: 20, steps: ['watched'] }),
  steps: [
    { id: 'account' },
    {
      id: 'watched',
      completesWith: { signal: 'plays', mutations: ['history:add'] },
    },
  ],
});

const second = buildOnboardingSet({
  id: 'second',
  unlocksAfter: 'first',
  steps: [
    {
      id: 'follow',
      completesWith: { signal: 'following', mutations: ['user:follow'] },
    },
  ],
});

const catalog = [first, second];

function select(
  overrides: Partial<Parameters<typeof selectActiveSet>[0]> = {},
) {
  return selectActiveSet({
    catalog,
    records: {},
    counts: {},
    user: ExtendedUserMappedMock,
    now: NOW,
    loadedAt: NOW,
    dismissedSetId: null,
    bypassesEligibility: false,
    ...overrides,
  });
}

describe('util: selectActiveSet', () => {
  it('should pick the first set for a fresh account', () => {
    expect(select().active?.set.id).toBe('first');
  });

  it('should keep a later tier locked until the one before closes', () => {
    expect(
      select({ records: { first: { startedAt: 0, steps: {} } } }).active?.set
        .id,
    ).toBe('first');
  });

  it('should move to the next tier once the first was completed on an earlier visit', () => {
    expect(
      select({
        records: { first: { startedAt: 0, completedAt: 10, steps: {} } },
      }).active?.set.id,
    ).toBe('second');
  });

  it('should keep a set completed during this visit on screen for its celebration', () => {
    expect(
      select({
        records: { first: { startedAt: 0, completedAt: NOW + 1, steps: {} } },
      }).active?.set.id,
    ).toBe('first');
  });

  it('should move on once the current set is dismissed', () => {
    expect(
      select({
        records: { first: { startedAt: 0, completedAt: NOW + 1, steps: {} } },
        dismissedSetId: 'first',
      }).active?.set.id,
    ).toBe('second');
  });

  it('should unlock a later tier when the account was never eligible for the one before', () => {
    const youngOnly = buildOnboardingSet({
      id: 'first',
      eligibleWhen: () => false,
      steps: [{ id: 'account' }],
    });

    expect(select({ catalog: [youngOnly, second] }).active?.set.id).toBe(
      'second',
    );
  });

  it('should keep a later tier locked while a director walks the one before', () => {
    expect(select({ bypassesEligibility: true }).active?.set.id).toBe('first');
  });

  it('should skip a set the account is not eligible for', () => {
    const old = buildOnboardingSet({
      id: 'only',
      eligibleWhen: () => false,
      steps: [{ id: 'account' }],
    });

    expect(select({ catalog: [old] }).active).toBeNull();
  });

  it('should hide a retired set and unlock the next one', () => {
    expect(
      select({
        records: { first: { startedAt: 0, retiredAt: 5, steps: {} } },
      }).active?.set.id,
    ).toBe('second');
  });

  it('should report a started set whose retire rule now holds', () => {
    const selection = select({
      records: { first: { startedAt: 0, steps: {} } },
      counts: { plays: 400 },
    });

    expect(selection.retiring).toEqual(['first']);
    expect(selection.active?.set.id).toBe('second');
  });

  it('should not report a set that never started', () => {
    expect(select({ counts: { plays: 400 } }).retiring).toEqual([]);
  });

  it('should keep a set whose history was built in the app', () => {
    const selection = select({
      records: {
        first: {
          startedAt: 0,
          steps: { watched: { status: 'done', at: 1, source: 'action' } },
        },
      },
      counts: { plays: 400 },
    });

    expect(selection.retiring).toEqual([]);
    expect(selection.active?.set.id).toBe('first');
  });

  it('should show retired and ineligible sets to directors', () => {
    expect(
      select({
        catalog: [
          buildOnboardingSet({
            id: 'only',
            eligibleWhen: () => false,
            steps: [{ id: 'account' }],
          }),
        ],
        bypassesEligibility: true,
      }).active?.set.id,
    ).toBe('only');
  });
});
