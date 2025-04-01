import { type MarkAsWatchedStoreProps } from './useMarkAsWatched.ts';

export type MarkAsWatchedActionProps = {
  style: 'normal' | 'action' | 'dropdown-item';
  title: string;
  // FIXME: remove prop when we fully split up mark-as-watched and remove
  allowRewatch?: boolean;
  size?: 'normal' | 'small';
} & MarkAsWatchedStoreProps;
