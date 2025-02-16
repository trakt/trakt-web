<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import type { MediaType } from "$lib/requests/models/MediaType";
  import FindMoviesLink from "../components/FindMoviesLink.svelte";
  import FindShowsLink from "../components/FindShowsLink.svelte";

  type EmptyWatchListProps = {
    type: MediaType;
    status: "all" | "out-now" | "coming-soon";
  };

  const { type, status }: EmptyWatchListProps = $props();
</script>

{#if type === "movie"}
  {#if status === "all"}
    <p class="small">{m.watchlist_movies_empty()}</p>
  {/if}

  {#if status === "out-now"}
    <p class="small">{m.out_now_empty()}</p>
  {/if}

  {#if status === "coming-soon"}
    <p class="small">{m.coming_soon_empty()}</p>
  {/if}

  <FindMoviesLink />
{/if}

{#if type === "show"}
  <p class="small">{m.watchlist_shows_empty()}</p>
  <FindShowsLink />
{/if}
