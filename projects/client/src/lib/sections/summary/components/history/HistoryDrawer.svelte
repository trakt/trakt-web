<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import ViewAllButton from "$lib/sections/lists/components/ViewAllButton.svelte";
  import { useRecentlyWatchedList } from "$lib/sections/lists/stores/useRecentlyWatchedList.ts";
  import { episodeActivityTitle } from "$lib/utils/intl/episodeActivityTitle.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { fade } from "svelte/transition";
  import HistoryList from "../details/_internal/HistoryList.svelte";
  import type { MediaDetailsProps } from "../details/MediaDetailsProps.ts";

  const { onClose, ...props }: { onClose: () => void } & MediaDetailsProps =
    $props();

  const { list, isLoading, hasNextPage } = $derived(
    useRecentlyWatchedList({
      type: props.type,
      id: props.type === "episode" ? props.episode.id : props.media.id,
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

  let isOpen = $state(false);
</script>

{#snippet badge()}
  <ViewAllButton
    {href}
    label={m.button_label_view_all_history()}
    disabled={!$hasNextPage}
    source={{ id: "media_watch_history", type: props.type }}
    size="small"
  />
{/snippet}

<Drawer
  {onClose}
  onOpened={() => (isOpen = true)}
  title={m.list_title_history()}
  size="auto"
  {badge}
>
  {#if isOpen}
    <div transition:fade={{ duration: 150 }}>
      <RenderFor audience="authenticated">
        <div class="trakt-media-watch-history">
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
    </div>
  {/if}
</Drawer>

<style>
  .trakt-media-watch-history {
    display: flex;
    flex-direction: column;
    gap: var(--gap-micro);
  }

  .watch-history-placeholder {
    padding-block: var(--gap-s);
  }
</style>
