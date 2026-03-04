<script lang="ts">
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import {
    drawerNavigation,
    Drawers,
  } from "$lib/features/drawers/drawerNavigation";
  import * as m from "$lib/features/i18n/messages";
  import CtaItem from "../components/cta/CtaItem.svelte";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import { useRecentlyWatchedList } from "../stores/useRecentlyWatchedList";
  import { toRecentlyWatchedType } from "./_internal/toRecentlyWatchedType";
  import RecentlyWatchedItem from "./RecentlyWatchedItem.svelte";

  const { mode }: { mode: DiscoverMode } = $props();

  const historyType = $derived(toRecentlyWatchedType(mode));

  const cta = $derived({
    type: "personal-activity" as const,
    mediaType: mode === "media" ? undefined : mode,
  });

  const { buildDrawerLink } = drawerNavigation();
</script>

<DrillableMediaList
  title={m.list_title_history()}
  id="personal-history-list"
  type="episode"
  useList={({ limit }: { limit: number }) =>
    useRecentlyWatchedList({
      type: historyType,
      limit,
      slug: "me",
    })}
  drilldownLabel={m.button_label_view_all_history()}
  source={{ id: "personal-history" }}
  urlBuilder={() => buildDrawerLink(Drawers.History)}
>
  {#snippet item(media)}
    <RecentlyWatchedItem {media} isActionable />
  {/snippet}

  {#snippet ctaItem()}
    <CtaItem {cta} variant="card" />
  {/snippet}

  {#snippet empty()}
    <CtaItem {cta} variant="placeholder" />
  {/snippet}
</DrillableMediaList>
