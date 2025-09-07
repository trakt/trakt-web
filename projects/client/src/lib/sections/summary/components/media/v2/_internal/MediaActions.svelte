<script lang="ts">
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import type { StreamOn } from "$lib/requests/models/StreamOn";
  import CheckInAction from "./CheckInAction.svelte";
  import RateAction from "./RateAction.svelte";
  import SaveAction from "./SaveAction.svelte";
  import WatchAction from "./WatchAction.svelte";

  const {
    title,
    media,
    type,
    streamOn,
  }: {
    title: string;
    media: MediaEntry;
    type: MediaType;
    streamOn?: StreamOn;
  } = $props();
</script>

<div class="trakt-media-actions">
  <!-- TODO disabled if no streamon -->
  {#if streamOn?.preferred}
    <WatchAction {streamOn} />
  {/if}

  <!-- TODO disabled if show -->
  {#if type === "movie"}
    <CheckInAction {media} />
  {/if}

  <RateAction {media} {type} />

  <SaveAction {title} {media} {type} />
</div>

<style>
  .trakt-media-actions {
    display: flex;
    gap: var(--gap-xxs);

    padding: var(--ni-10);

    background-color: var(--color-card-background);
    border-radius: var(--border-radius-m);
    /* TODO shadow */
  }
</style>
