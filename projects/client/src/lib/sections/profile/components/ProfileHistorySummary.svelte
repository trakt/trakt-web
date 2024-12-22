<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { HistoryMovie } from "$lib/requests/queries/users/movieHistoryQuery";
  import type { HistoryShow } from "$lib/requests/queries/users/showHistoryQuery";
  import ProfileMediaHistory from "./ProfileMediaHistory.svelte";

  type ProfileHistorySummaryProps = {
    movies?: HistoryMovie[];
    shows?: HistoryShow[];
  };

  const { movies, shows }: ProfileHistorySummaryProps = $props();

  const showItems = $derived((shows ?? []).map((item) => item.episode));
  const movieItems = $derived((movies ?? []).map((item) => item.movie));
  // TODO: add loading state
</script>

<div class="trakt-profile-history-summary">
  <h5>{m.last_30_days_watched()}</h5>
  <div class="trakt-profile-history-content">
    {#if shows && movies}
      <ProfileMediaHistory
        title={m.shows()}
        items={showItems}
        footer={m.episodes_watched({ count: showItems.length })}
      />
      <ProfileMediaHistory
        title={m.movies()}
        items={movieItems}
        footer={m.movies_watched({ count: movieItems.length })}
      />
    {/if}
  </div>
</div>

<style>
  .trakt-profile-history-summary {
    min-height: var(--ni-104);
    border-radius: var(--ni-12);
    background-color: var(--purple-900);
    padding: var(--ni-24) var(--ni-16) var(--ni-24) var(--ni-16);
    display: flex;
    flex-direction: column;
    gap: var(--ni-20);
    box-shadow: 0 var(--ni-4) var(--ni-8) 0 rgba(0, 0, 0, 0.24);
  }

  .trakt-profile-history-content {
    display: flex;
    justify-content: space-between;

    @media (max-width: 1024px) {
      flex-direction: column;
      gap: var(--ni-24);
    }
  }
</style>
