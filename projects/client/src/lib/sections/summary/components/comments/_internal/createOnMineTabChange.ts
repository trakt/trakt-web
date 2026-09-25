import type { CommentSortType } from '$lib/requests/models/CommentSortType.ts';

type CreateOnMineTabChangeParams = {
  setMineActive: (value: boolean) => void;
  setSort: (value: CommentSortType) => void;
};

export function createOnMineTabChange(
  { setMineActive, setSort }: CreateOnMineTabChangeParams,
) {
  return (value: CommentSortType | 'mine') => {
    if (value === 'mine') {
      setMineActive(true);
      return;
    }
    setMineActive(false);
    setSort(value);
  };
}
