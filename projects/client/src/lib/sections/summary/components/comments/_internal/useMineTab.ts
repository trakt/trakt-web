import { useToggler } from '$lib/components/toggles/useToggler.ts';
import { FeatureFlag } from '$lib/features/feature-flag/models/FeatureFlag.ts';
import { useFeatureFlag } from '$lib/features/feature-flag/useFeatureFlag.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { createOnMineTabChange } from './createOnMineTabChange.ts';
import { toCommentSortOptionsWithMine } from './toCommentSortOptionsWithMine.ts';

export function useMineTab() {
  const { current: sort, set: setSort, options } = useToggler('comment');
  const { isEnabled } = useFeatureFlag();

  const mineActive = new BehaviorSubject(false);

  const sortOptions = isEnabled(FeatureFlag.ReviewsMineTab).pipe(
    map((isMineTabEnabled) =>
      toCommentSortOptionsWithMine(options, isMineTabEnabled)
    ),
  );

  const activeTab = combineLatest([mineActive, sort]).pipe(
    map(([isMine, $sort]) => isMine ? 'mine' as const : $sort.value),
  );

  const activeText = combineLatest([mineActive, sort]).pipe(
    map(([isMine, $sort]) => isMine ? m.button_text_mine_reviews : $sort.text),
  );

  const onTabChange = createOnMineTabChange({
    setMineActive: (value) => mineActive.next(value),
    setSort,
  });

  return { sort, mineActive, sortOptions, activeTab, activeText, onTabChange };
}
