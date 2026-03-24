<script lang="ts">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import * as m from "$lib/features/i18n/messages";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import ViewAllButton from "$lib/sections/lists/components/ViewAllButton.svelte";
  import { useRecentlyWatchedList } from "$lib/sections/lists/stores/useRecentlyWatchedList";
  import { episodeActivityTitle } from "$lib/utils/intl/episodeActivityTitle";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { MediaDetailsProps } from "../MediaDetailsProps";
  import HistoryList from "./HistoryList.svelte";

  const historyLimit = 3;

  const props: MediaDetailsProps = $props();

  const { list, isLoading, hasNextPage } = $derived(
    useRecentlyWatchedList({
      type: props.type,
      id: props.type === "episode" ? props.episode.id : props.media.id,
      limit: historyLimit,
    }),
  );

  const href = $derived.by(() => {
    switch (props.type) {
      case "movie":
        return UrlBuilder.history.movie(props.media.slug);
      case "show":
        return UrlBuilder.history.show(props.media.slug);
      case "episode":
        return UrlBuilder.history.episode(
          props.show.slug,
          props.episode.season,
          props.episode.number,
        );
    }
  });

  const title = $derived.by(() => {
    switch (props.type) {
      case "movie":
      case "show":
        return props.media.title;
      case "episode":
        return episodeActivityTitle(props.episode, props.show);
    }
  });

  const hasHistory = $derived($list.length > 0);
</script>

<RenderFor audience="authenticated">
  <div class="trakt-media-watch-history">
    <div class="trakt-media-watch-history-header">
      <p class="bold secondary ellipsis">{m.list_title_history()}</p>
      <ViewAllButton
        {href}
        label={m.button_label_view_all_history()}
        disabled={!$hasNextPage}
        source={{ id: "media_watch_history", type: props.type }}
        size="small"
      />
    </div>

    {#if $isLoading && !hasHistory}
      <LoadingIndicator />
    {/if}

    {#if !$isLoading && !hasHistory}
      <p class="italic watch-history-placeholder">
        {m.list_placeholder_media_history({ title })}
      </p>
    {/if}

    {#if hasHistory}
      <HistoryList list={$list} />
    {/if}
  </div>
</RenderFor>

<style>
  .trakt-media-watch-history {
    display: flex;
    flex-direction: column;
    gap: var(--gap-micro);
  }

  .trakt-media-watch-history-header {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }

  .watch-history-placeholder {
    padding-block: var(--gap-s);
  }
</style>
