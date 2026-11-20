import { z } from 'zod';
import { describe, expect, it } from 'vitest';
import type { ClientStateDefinition } from '../models/ClientStateDefinition.ts';
import type { ClientStateKey } from '../models/ClientStateKey.ts';
import { readLocalState } from './readLocalState.ts';

const definition: ClientStateDefinition<Record<string, string>> = {
  key: 'test_state' as unknown as ClientStateKey,
  legacyStorageKey: 'trakt-dismissed-banners',
  schema: z.record(z.string(), z.string()),
  empty: {},
  merge: (local, remote) => ({ ...remote, ...local }),
};

function storageOf(entries: Record<string, string>) {
  return { getItem: (key: string) => entries[key] ?? null };
}

describe('readLocalState', () => {
  it('should read the copy scoped to the user', () => {
    expect(
      readLocalState({
        definition,
        userId: 42,
        storage: storageOf({
          'trakt-client-state:test_state:42': '{"welcome":"dismissed"}',
          'trakt-dismissed-banners': '{"yir":"2026"}',
        }),
      }),
    ).to.deep.equal({ welcome: 'dismissed' });
  });

  it('should seed from the legacy key when the user has no copy yet', () => {
    expect(
      readLocalState({
        definition,
        userId: 42,
        storage: storageOf({ 'trakt-dismissed-banners': '{"yir":"2026"}' }),
      }),
    ).to.deep.equal({ yir: '2026' });
  });

  it('should migrate the legacy value when a migration is given', () => {
    expect(
      readLocalState({
        definition: {
          ...definition,
          fromLegacy: (legacy, userId) => ({
            migrated: `${userId}:${JSON.stringify(legacy)}`,
          }),
        },
        userId: 7,
        storage: storageOf({ 'trakt-dismissed-banners': '{"a":"b"}' }),
      }),
    ).to.deep.equal({ migrated: '7:{"a":"b"}' });
  });

  it('should read a legacy value stored as plain text', () => {
    expect(
      readLocalState({
        definition: {
          ...definition,
          schema: z.record(z.string(), z.string()),
          fromLegacy: (legacy) => ({ language: legacy }),
        },
        userId: 42,
        storage: storageOf({ 'trakt-dismissed-banners': 'es' }),
      }),
    ).to.deep.equal({ language: 'es' });
  });

  it('should not look for legacy data without a legacy key', () => {
    expect(
      readLocalState({
        definition: { ...definition, legacyStorageKey: undefined },
        userId: 42,
        storage: storageOf({ 'trakt-dismissed-banners': '{"yir":"2026"}' }),
      }),
    ).to.deep.equal({});
  });

  it('should keep guests in their own scope', () => {
    expect(
      readLocalState({
        definition,
        userId: 0,
        storage: storageOf({
          'trakt-client-state:test_state:guest': '{"welcome":"dismissed"}',
        }),
      }),
    ).to.deep.equal({ welcome: 'dismissed' });
  });

  it('should fall back to empty for unreadable or invalid values', () => {
    expect(
      readLocalState({
        definition,
        userId: 42,
        storage: storageOf({
          'trakt-client-state:test_state:42': '{broken',
        }),
      }),
    ).to.deep.equal({});
    expect(
      readLocalState({
        definition,
        userId: 42,
        storage: storageOf({
          'trakt-client-state:test_state:42': '[1,2]',
        }),
      }),
    ).to.deep.equal({});
  });
});
