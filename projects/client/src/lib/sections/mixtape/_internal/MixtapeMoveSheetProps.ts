import type { UserList } from '$lib/requests/queries/users/userListsQuery.ts';
import type { MixtapeTarget } from './MixtapeTarget.ts';

export type MixtapeMoveChoice =
  | { target: MixtapeTarget; name: string }
  | { newName: string };

export type MixtapeMoveSheetProps = {
  current: MixtapeTarget;
  currentName: string;
  lists: ReadonlyArray<UserList>;
  suggestedName: string;
  isMoving: boolean;
  onClose: () => void;
  onConfirm: (choice: MixtapeMoveChoice) => void;
};
