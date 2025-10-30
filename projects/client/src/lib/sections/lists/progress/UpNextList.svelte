<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DEFAULT_PAGE_SIZE } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CtaItem from "../components/cta/CtaItem.svelte";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import { useStablePaginated } from "../stores/useStablePaginated";
  import ContinueWatchingItem from "./_internal/ContinueWatchingItem.svelte";
  import StartWatchingItem from "./_internal/StartWatchingItem.svelte";
  import { useUpNextList } from "./useUpNextList";

  const { intent }: { intent: "continue" | "start" } = $props();

  const { user } = useUser();
  const { mode } = useDiscover();

  const cta = $derived({
    type:
      intent === "start" ? ("start-watching" as const) : ("up-next" as const),
    mediaType: $mode === "media" ? undefined : $mode,
  });
</script>

<DrillableMediaList
  type={$mode}
  id={`up-next-list-${$mode}-${intent}`}
  source={{
    id: intent === "start" ? "start-watching" : "continue-watching",
  }}
  drilldownLabel={"drill label"}
  useList={() =>
    useStablePaginated({
      type: $mode,
      page: 1,
      limit: DEFAULT_PAGE_SIZE,
      useList: (params) =>
        useUpNextList({
          ...params,
          intent,
        }),
      compareFn: (l, r) => {
        const isComparingEpisodes = "show" in l && "show" in r;
        return isComparingEpisodes ? l.show.id === r.show.id : l.id === r.id;
      },
    })}
  urlBuilder={() =>
    intent === "start"
      ? UrlBuilder.startWatching($user?.slug ?? "")
      : UrlBuilder.progress($user?.slug ?? "")}
  title={intent === "start"
    ? m.list_title_start_watching()
    : m.list_title_up_next()}
  variant={intent === "start" ? "portrait" : "landscape"}
>
  {#snippet item(progressEntry)}
    {#if intent === "start"}
      <StartWatchingItem entry={progressEntry} style="cover" />
    {:else}
      <ContinueWatchingItem entry={progressEntry} style="cover" />
    {/if}
  {/snippet}

  {#snippet ctaItem()}
    <CtaItem {cta} variant="card" />
  {/snippet}

  {#snippet empty()}
    <CtaItem {cta} variant="placeholder" />
  {/snippet}
</DrillableMediaList>
