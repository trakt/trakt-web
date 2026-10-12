import { isSameState } from './isSameState.ts';

type ReconcileClientStateProps<T> = {
  local: T;
  remote: T | null;
  empty: T;
  merge: (local: T, remote: T) => T;
};

export function reconcileClientState<T>(
  { local, remote, empty, merge }: ReconcileClientStateProps<T>,
): { value: T; shouldUpload: boolean } {
  if (remote === null) {
    return { value: local, shouldUpload: !isSameState(local, empty) };
  }

  const value = merge(local, remote);
  return { value, shouldUpload: !isSameState(value, remote) };
}
