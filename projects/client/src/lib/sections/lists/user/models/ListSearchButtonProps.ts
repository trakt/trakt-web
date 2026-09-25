import type { ListSearchCopy } from './ListSearchCopy.ts';

export type ListSearchButtonProps = {
  isActive: boolean;
  copy: ListSearchCopy;
  onclick: () => void;
};
