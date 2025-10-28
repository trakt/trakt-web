<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { type DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
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
</script>

{#snippet content(
  type: DiscoverMode,
  upNextIntent: "all" | "continue" | "start",
)}
  <DrillableMediaList
    {type}
    id={`up-next-list-${type}-${upNextIntent}`}
    source={{
      id: upNextIntent === "start" ? "start-watching" : "continue-watching",
    }}
    drilldownLabel={"drill label"}
    useList={() =>
      useStablePaginated({
        type,
        page: 1,
        limit: DEFAULT_PAGE_SIZE,
        useList: (params) =>
          useUpNextList({
            ...params,
            intent: upNextIntent,
          }),
        compareFn: (l, r) => {
          const isComparingEpisodes = "show" in l && "show" in r;
          return isComparingEpisodes ? l.show.id === r.show.id : l.id === r.id;
        },
      })}
    urlBuilder={() =>
      upNextIntent === "start"
        ? UrlBuilder.startWatching($user?.slug ?? "")
        : UrlBuilder.progress($user?.slug ?? "")}
    title={upNextIntent === "start"
      ? m.list_title_start_watching()
      : m.list_title_up_next()}
    variant={intent === "start" ? "portrait" : "landscape"}
  >
    {#snippet item(progressEntry)}
      {#if upNextIntent === "start"}
        <StartWatchingItem entry={progressEntry} style="cover" />
      {:else}
        <ContinueWatchingItem entry={progressEntry} style="cover" />
      {/if}
    {/snippet}

    {#snippet ctaItem()}
      <CtaItem
        cta={{
          type: intent === "start" ? "start-watching" : "up-next",
          mediaType: type === "media" ? undefined : type,
        }}
        variant="card"
      />
    {/snippet}

    {#snippet empty()}
      <CtaItem
        cta={{
          type: intent === "start" ? "start-watching" : "up-next",
          mediaType: type === "media" ? undefined : type,
        }}
        variant="placeholder"
      />
    {/snippet}
  </DrillableMediaList>
{/snippet}

<RenderForFeature flag={FeatureFlag.Discover}>
  {#snippet enabled()}
    {@render content($mode, intent)}
  {/snippet}

  {@render content("show", "all")}
</RenderForFeature>
