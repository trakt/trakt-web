type ToAddFromListsAccessProps = {
  isOwner: boolean;
  isCollaborator: boolean;
  hasCollaborators: boolean;
};

export function toAddFromListsAccess(
  { isOwner, isCollaborator, hasCollaborators }: ToAddFromListsAccessProps,
) {
  return {
    canAddFromLists: isOwner || isCollaborator,
    isSharedList: isCollaborator || (isOwner && hasCollaborators),
  };
}
