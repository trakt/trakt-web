<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaProgressIntent } from "$lib/requests/queries/sync/mediaProgressQuery";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CtaItem from "../components/cta/CtaItem.svelte";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import { useStablePaginated } from "../stores/useStablePaginated";
  import ContinueWatchingItem from "./_internal/ContinueWatchingItem.svelte";
  import StartWatchingItem from "./_internal/StartWatchingItem.svelte";
  import { useUpNextList } from "./useUpNextList";

  const { intent }: { intent: MediaProgressIntent } = $props();

  const { user } = useUser();
  const { mode } = useDiscover();

  const cta = $derived({
    type:
      intent === "start" ? ("start-watching" as const) : ("up-next" as const),
    mediaType: $mode === "media" ? undefined : $mode,
  });

  const { filterMap } = useFilter();

  const watchedProgressUrl = $derived(
    `${UrlBuilder.progress($user?.slug ?? "me")}/watched`,
  );
</script>

<DrillableMediaList
  type={$mode}
  id={`up-next-list-${$mode}-${intent}`}
  source={{
    id: intent === "start" ? "start-watching" : "continue-watching",
  }}
  drilldownLabel="drill label"
  filter={$filterMap}
  useList={(listParams) =>
    useStablePaginated({
      ...listParams,
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
  {#snippet actions(_items, _type)}
    {#if intent === "continue"}
      <ActionButton
        style="ghost"
        href={watchedProgressUrl}
        label="View watched progress"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="1"
            y="9"
            width="3"
            height="6"
            rx="0.5"
            fill="currentColor"
          />
          <rect
            x="6.5"
            y="5"
            width="3"
            height="10"
            rx="0.5"
            fill="currentColor"
          />
          <rect
            x="12"
            y="1"
            width="3"
            height="14"
            rx="0.5"
            fill="currentColor"
          />
        </svg>
      </ActionButton>
    {/if}
  {/snippet}

  {#snippet item(progressEntry)}
    {#if progressEntry.intent === "start"}
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
