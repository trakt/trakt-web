<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import IconWrapper from "$lib/components/icons/IconWrapper.svelte";
  import TrackIcon from "$lib/components/icons/TrackIcon.svelte";
  import { useActionToast } from "$lib/features/action-toast/useActionToast.ts";
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useEpisodeSpoilerImage } from "$lib/features/spoilers/useEpisodeSpoilerImage.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { ListTarget } from "$lib/models/ListTarget";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { Season } from "$lib/requests/models/Season";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import ListAction from "$lib/sections/components/lists-drawer/ListAction.svelte";
  import { manageListsDrawerStore } from "$lib/sections/components/lists-drawer/manageListsDrawerStore";
  import EpisodeItem from "$lib/sections/lists/components/EpisodeItem.svelte";
  import type { BaseItemProps } from "$lib/sections/lists/components/models/BaseItemProps";
  import type { CardUrlOverride } from "$lib/sections/lists/components/models/CardUrlOverride";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import WatchedUntilHereDrawer from "$lib/sections/media-actions/mark-as-watched/_internal/watch-until-here/WatchedUntilHereDrawer.svelte";
  import { countSkippedEpisodes } from "$lib/sections/media-actions/mark-as-watched/_internal/watch-until-here/countSkippedEpisodes.ts";
  import { useWatchUntilHereEpisodes } from "$lib/sections/media-actions/mark-as-watched/_internal/watch-until-here/useWatchUntilHereEpisodes.ts";
  import { useMarkAsWatched } from "$lib/sections/media-actions/mark-as-watched/useMarkAsWatched";
  import { scrollActiveItemIntoView } from "$lib/utils/actions/scrollActiveItemIntoView";
  import { episodeMetaInfo } from "$lib/utils/intl/episodeMetaInfo";
  import { onDestroy } from "svelte";
  import { time } from "$lib/utils/timing/time.ts";

  type SeasonEpisodeItemProps = {
    show: ShowEntry;
    episode: EpisodeEntry;
    previousSeasons: Season[];
    hasUnseenEpisodes: boolean;
    currentSeasonEpisodes: EpisodeEntry[];
    watchedBySeason: ReadonlyMap<number, ReadonlySet<number>>;
    isWatchedLoading: boolean;
    isCurrentEpisode?: boolean;
    isScrollTarget?: boolean;
    isConcealed?: boolean;
    style?: BaseItemProps["style"];
    source: string;
    urlOverride?: CardUrlOverride;
    /**
     * Which way this item's container scrolls when it is the scroll
     * target. The rail is a horizontal strip; the seasons drawer is a
     * vertical list several levels inside a scrolling body.
     */
    scrollAxis?: "inline" | "block" | "none";
  };

  const {
    show,
    episode,
    previousSeasons,
    hasUnseenEpisodes,
    currentSeasonEpisodes,
    watchedBySeason,
    isWatchedLoading,
    isCurrentEpisode = false,
    isScrollTarget = false,
    isConcealed = false,
    style,
    source,
    urlOverride,
    scrollAxis = "inline",
  }: SeasonEpisodeItemProps = $props();

  const isFuture = $derived(episode.effectiveReleaseDate > new Date());
  const hasBulkMarkAsWatched = $derived(
    hasUnseenEpisodes && episode.effectiveReleaseDate && !isFuture,
  );

  const { isWatchable } = $derived(
    useMarkAsWatched({ type: "episode", media: episode, show }),
  );

  const isActionable = $derived(
    !isFuture && (isWatchable || hasBulkMarkAsWatched),
  );
  const variant = $derived(isFuture ? "upcoming" : "default");

  const skippedCount = $derived(
    countSkippedEpisodes({
      target: { season: episode.season, number: episode.number },
      currentSeasonEpisodes,
      previousSeasons,
      watchedBySeason,
    }),
  );

  const { isAuthorized } = useAuth();
  const { user } = useUser();
  const target = $derived<ListTarget>({ type: "episode", media: episode });
  const listMetaInfo = $derived(episodeMetaInfo(episode, show.title));
  const hasPopupActions = $derived(
    isActionable || ($isAuthorized && $user != null),
  );

  const src = $derived(
    useEpisodeSpoilerImage({
      episode,
      show,
      variant,
    }),
  );

  let watchUntilOpening = $state<"menu" | "toast" | null>(null);

  const { notify, dismiss } = useActionToast();
  let gapToastId: string | null = null;

  const offerGapFill = () => {
    if (skippedCount === 0) {
      return;
    }

    gapToastId = notify({
      message: m.confirmation_title_watched_until_here(),
      durationMs: time.seconds(10),
      action: {
        text: m.button_text_watched_until_here(),
        label: m.button_label_watched_until_here({ title: show.title }),
        onAction: () => {
          watchUntilOpening = "toast";
        },
      },
    });
  };

  onDestroy(() => {
    if (gapToastId) dismiss(gapToastId);
  });

  const watchUntilResolver = $derived.by(() => {
    if (!watchUntilOpening) return null;
    return useWatchUntilHereEpisodes({
      showSlug: show.slug,
      targetEpisode: { season: episode.season, number: episode.number },
      previousSeasons,
      currentSeasonEpisodes,
      watchedBySeason,
      includesTarget: watchUntilOpening === "menu",
    });
  });
  const resolvedEpisodes = $derived(watchUntilResolver?.episodes);
  const isResolvingEpisodes = $derived(watchUntilResolver?.isLoading);
</script>

{#snippet popupActions()}
  <RenderFor audience="authenticated">
    {#if isActionable}
      <MarkAsWatchedAction
        style="dropdown-item"
        type="episode"
        title={episode.title}
        {show}
        media={episode}
        mode="hybrid"
        onWatched={offerGapFill}
      />
    {/if}
    {#if hasBulkMarkAsWatched}
      <DropdownItem
        onclick={() => (watchUntilOpening = "menu")}
        label={m.button_label_watched_until_here({ title: show.title })}
        disabled={isWatchedLoading}
      >
        {m.button_text_watched_until_here()}
        {#snippet icon()}
          <IconWrapper isLoading={isWatchedLoading}>
            <TrackIcon state="unwatched" />
          </IconWrapper>
        {/snippet}
      </DropdownItem>
    {/if}
    <ListAction
      style="dropdown-item"
      {target}
      title={episode.title}
      onClick={() =>
        manageListsDrawerStore.open({
          target,
          title: episode.title,
          metaInfo: listMetaInfo,
        })}
    />
  </RenderFor>
{/snippet}

{#snippet episodeItem()}
  <EpisodeItem
    {episode}
    media={show}
    {style}
    popupActions={hasPopupActions ? popupActions : undefined}
    variant={isFuture ? "upcoming" : "default"}
    context="show"
    {source}
    {urlOverride}
    coverUrl={$src}
    onWatched={offerGapFill}
  />
{/snippet}

<!--
  Keep a single, stable render position for the episode item. Branching on
  isCurrentEpisode would remount EpisodeItem (image reload/blink) whenever the
  active episode changes. The scroll action is a no-op when not the target.
-->
<div
  use:scrollActiveItemIntoView={{
    active: isScrollTarget && scrollAxis !== "none",
    axis: scrollAxis === "block" ? "block" : "inline",
  }}
  class="trakt-season-episode-item"
  class:is-current-episode={isCurrentEpisode}
  data-concealed={isConcealed}
  aria-current={isCurrentEpisode ? "page" : undefined}
>
  {@render episodeItem()}
</div>

{#if watchUntilOpening && resolvedEpisodes}
  <WatchedUntilHereDrawer
    {show}
    title={show.title}
    episodes={$resolvedEpisodes ?? []}
    isResolvingEpisodes={$isResolvingEpisodes ?? false}
    onClose={() => (watchUntilOpening = null)}
  />
{/if}

<style lang="scss">
  .trakt-season-episode-item {
    transition: opacity var(--transition-increment) ease-in-out;

    &[data-concealed="true"]:not(:focus-within) {
      opacity: 0;
      pointer-events: none;
    }
  }

  /*
    Marks the episode currently open in the drawer. The ring reuses the token
    behind the hover and d-pad focus rings, and the title switches to the
    emphasis colour so the card stays distinct while a neighbour is hovered.
  */
  .trakt-season-episode-item.is-current-episode {
    --color-override-card-outline: var(--color-card-border-hover);
    --color-override-card-title: var(--color-text-emphasis);
  }
</style>
