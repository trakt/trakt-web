<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode.ts";
  import { useFilter } from "$lib/features/filters/useFilter.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { isStorySeen } from "./_internal/isStorySeen.ts";
  import TodayStoryBubble from "./_internal/TodayStoryBubble.svelte";
  import { toStoryGroups } from "./_internal/toStoryGroups.ts";
  import { useTodaySeenStories } from "./useTodaySeenStories.ts";
  import { useTodayStories } from "./useTodayStories.ts";

  const { type }: { type: DiscoverMode } = $props();

  const { filterMap } = useFilter();
  const { titles, forYou } = $derived(
    useTodayStories({ type, filter: $filterMap }),
  );
  const { seenStories } = useTodaySeenStories();

  const groups = $derived(
    toStoryGroups({ forYou: $forYou ?? [], titles: $titles ?? [] }),
  );
</script>

{#if groups.length > 0}
  <div class="trakt-today-rail">
    <SectionList
      id={{ scope: "today-stories" }}
      items={groups}
      title={m.list_title_today()}
      drilldown={{
        label: m.button_label_view_all_today(),
        href: UrlBuilder.today(),
        source: { id: "today" },
        mode: "always",
      }}
    >
      {#snippet item(group)}
        <TodayStoryBubble
          {group}
          isSeen={isStorySeen({ group, seenStories: $seenStories })}
        />
      {/snippet}
    </SectionList>
  </div>
{/if}

<style>
  .trakt-today-rail {
    display: contents;

    --height-override-list: calc(var(--ni-104) + var(--ni-48));
  }
</style>
