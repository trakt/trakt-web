<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import type { MediaType } from "$lib/requests/models/MediaType";
  import FindMoviesLink from "../components/FindMoviesLink.svelte";
  import FindShowsLink from "../components/FindShowsLink.svelte";

  type EmptyWatchListProps = {
    type?: MediaType;
    status: "all" | "released" | "unreleased";
  };

  const { type, status }: EmptyWatchListProps = $props();
</script>

{#if type === "movie"}
  {#if status === "all"}
    <p class="small">{m.list_placeholder_watchlist_movies()}</p>
  {/if}

  {#if status === "released"}
    <p class="small">{m.list_placeholder_released_movies()}</p>
  {/if}

  {#if status === "unreleased"}
    <p class="small">{m.list_placeholder_unreleased_movies()}</p>
  {/if}

  <FindMoviesLink />
{/if}

{#if type === "show"}
  <p class="small">{m.list_placeholder_watchlist_shows()}</p>
  <FindShowsLink />
{/if}

{#if status === "all" && !type}
  <p class="small">{m.list_placeholder_watchlist()}</p>
{/if}
