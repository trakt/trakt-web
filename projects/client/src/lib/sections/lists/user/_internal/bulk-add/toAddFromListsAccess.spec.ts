import { describe, expect, it } from 'vitest';
import { toAddFromListsAccess } from './toAddFromListsAccess.ts';

describe('util: toAddFromListsAccess', () => {
  it('should allow the owner of a solo list without marking it shared', () => {
    expect(
      toAddFromListsAccess({
        isOwner: true,
        isCollaborator: false,
        hasCollaborators: false,
      }),
    ).toEqual({ canAddFromLists: true, isSharedList: false });
  });

  it('should mark a list with collaborators as shared for its owner', () => {
    expect(
      toAddFromListsAccess({
        isOwner: true,
        isCollaborator: false,
        hasCollaborators: true,
      }),
    ).toEqual({ canAddFromLists: true, isSharedList: true });
  });

  it('should allow a collaborator and mark the list as shared', () => {
    expect(
      toAddFromListsAccess({
        isOwner: false,
        isCollaborator: true,
        hasCollaborators: true,
      }),
    ).toEqual({ canAddFromLists: true, isSharedList: true });
  });

  it('should deny anyone else', () => {
    expect(
      toAddFromListsAccess({
        isOwner: false,
        isCollaborator: false,
        hasCollaborators: true,
      }),
    ).toEqual({ canAddFromLists: false, isSharedList: false });
  });
});
