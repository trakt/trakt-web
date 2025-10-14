import type { MarkAsWatchedStoreProps } from '$lib/sections/media-actions/mark-as-watched/useMarkAsWatched.ts';
import type { ConfirmationType } from './ConfirmationType.ts';

interface ConfirmationParamsMap {
  [ConfirmationType.MarkAsWatched]: {
    type: ConfirmationType.MarkAsWatched;
    title: string;
    target: MarkAsWatchedStoreProps;
  };
  [ConfirmationType.RemoveFromList]: {
    type: ConfirmationType.RemoveFromList;
    title: string;
    name: string;
  };
  [ConfirmationType.DeleteList]: {
    type: ConfirmationType.DeleteList;
    name: string;
  };
  [ConfirmationType.UnfollowUser]: {
    type: ConfirmationType.UnfollowUser;
    username: string;
  };
  [ConfirmationType.RemoveFromWatched]: {
    type: ConfirmationType.RemoveFromWatched;
    title: string;
  };
  [ConfirmationType.RemoveFromHistory]: {
    type: ConfirmationType.RemoveFromHistory;
    title: string;
  };
  [ConfirmationType.DropShow]: {
    type: ConfirmationType.DropShow;
    title: string;
  };
  [ConfirmationType.RestoreShow]: {
    type: ConfirmationType.RestoreShow;
    title: string;
  };
  [ConfirmationType.RemoveFavorite]: {
    type: ConfirmationType.RemoveFavorite;
    title: string;
  };
  [ConfirmationType.RemoveFromWatchList]: {
    type: ConfirmationType.RemoveFromWatchList;
    title: string;
  };
  [ConfirmationType.StopCheckin]: {
    type: ConfirmationType.StopCheckin;
    title: string;
  };
}

export type ConfirmationParams<T extends ConfirmationType> =
  ConfirmationParamsMap[T];
