type ListOwner = { isPrivate?: boolean } | Nil;

export function toDefaultListPrivacy(owner: ListOwner): 'public' | 'private' {
  return owner?.isPrivate ? 'private' : 'public';
}
