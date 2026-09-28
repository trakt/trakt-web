import { DRAWER_VIEW_PARAM } from '$lib/components/drawer/constants/index.ts';
import { drawerNavigation } from '$lib/components/drawer/drawerNavigation.ts';

const TODAY_STORY_VIEW = 'today-story';
const TODAY_STORY_PARAM = 'story';

type TodayStoryView = typeof TODAY_STORY_VIEW;

export function todayStoryNavigation(searchParams?: URLSearchParams) {
  const isOpen = searchParams?.get(DRAWER_VIEW_PARAM) === TODAY_STORY_VIEW;
  const navigation = drawerNavigation<
    TodayStoryView,
    Record<TodayStoryView, Record<typeof TODAY_STORY_PARAM, string>>
  >({ [TODAY_STORY_VIEW]: { [TODAY_STORY_PARAM]: '' } });

  return {
    isOpen,
    storyKey: isOpen ? searchParams?.get(TODAY_STORY_PARAM) ?? null : null,
    storyLink: (storyKey: string) =>
      navigation.buildDrawerLink(TODAY_STORY_VIEW, {
        [TODAY_STORY_PARAM]: storyKey,
      }),
    close: navigation.close,
  };
}
