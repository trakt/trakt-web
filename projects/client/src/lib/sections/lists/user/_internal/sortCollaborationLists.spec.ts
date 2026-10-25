import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import { PersonalListsMappedMock } from '$mocks/data/users/mapped/PersonalListsMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { sortCollaborationLists } from './sortCollaborationLists.ts';

const baseList = PersonalListsMappedMock.at(0) as MediaListSummary;

function createList({
  id,
  name,
  createdAt,
  updatedAt,
}: {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}): MediaListSummary {
  return {
    ...baseList,
    id,
    key: `list-${id}`,
    name,
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
  };
}

const ownedOld = createList({
  id: 1,
  name: 'zombies',
  createdAt: '2020-01-01',
  updatedAt: '2024-01-01',
});
const ownedNew = createList({
  id: 2,
  name: 'Mysteries',
  createdAt: '2023-01-01',
  updatedAt: '2025-01-01',
});
const sharedNewest = createList({
  id: 3,
  name: 'Anime',
  createdAt: '2019-01-01',
  updatedAt: '2026-01-01',
});

const owned = [ownedOld, ownedNew];
const shared = [sharedNewest];

const toIds = (lists: MediaListSummary[]) => lists.map((list) => list.id);

describe('util: sortCollaborationLists', () => {
  it('should put owned lists first by default, most recently updated first', () => {
    const result = sortCollaborationLists({
      owned,
      shared,
      sortBy: undefined,
      sortHow: 'desc',
    });

    expect(toIds(result)).toEqual([2, 1, 3]);
  });

  it('should reverse the order within each group for an ascending default sort', () => {
    const result = sortCollaborationLists({
      owned,
      shared,
      sortBy: undefined,
      sortHow: 'asc',
    });

    expect(toIds(result)).toEqual([1, 2, 3]);
  });

  it('should treat rank as the default sort', () => {
    const result = sortCollaborationLists({
      owned,
      shared,
      sortBy: 'rank',
      sortHow: 'desc',
    });

    expect(toIds(result)).toEqual([2, 1, 3]);
  });

  it('should mix owned and shared lists when sorting by updated date', () => {
    const result = sortCollaborationLists({
      owned,
      shared,
      sortBy: 'updated_at',
      sortHow: 'desc',
    });

    expect(toIds(result)).toEqual([3, 2, 1]);
  });

  it('should sort by name ignoring case', () => {
    const result = sortCollaborationLists({
      owned,
      shared,
      sortBy: 'name',
      sortHow: 'asc',
    });

    expect(toIds(result)).toEqual([3, 2, 1]);
  });

  it('should sort by created date', () => {
    const result = sortCollaborationLists({
      owned,
      shared,
      sortBy: 'created_at',
      sortHow: 'desc',
    });

    expect(toIds(result)).toEqual([2, 1, 3]);
  });

  it('should keep the owned copy when a list appears in both sources', () => {
    const result = sortCollaborationLists({
      owned,
      shared: [...shared, ownedOld],
      sortBy: undefined,
      sortHow: 'desc',
    });

    expect(toIds(result)).toEqual([2, 1, 3]);
  });
});
