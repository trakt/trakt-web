<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MovieActivityHistory } from "$lib/requests/queries/users/movieActivityHistoryQuery";
  import type { ShowActivityHistory } from "$lib/requests/queries/users/showActivityHistoryQuery";
  import ProfileMediaHistory from "./ProfileMediaHistory.svelte";

  type ProfileHistorySummaryProps = {
    movies?: MovieActivityHistory[];
    shows?: ShowActivityHistory[];
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

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-profile-history-summary {
    height: var(--ni-104);
    border-radius: var(--ni-12);
    color: var(--shade-10);
    background-color: color-mix(in srgb, var(--purple-500), transparent 85%);
    backdrop-filter: blur(var(--ni-16));
    padding: var(--ni-24);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--gap-xs);
    box-shadow: 0 var(--ni-4) var(--ni-8) 0 rgba(0, 0, 0, 0.24);
  }

  .trakt-profile-history-content {
    display: flex;
    justify-content: space-between;
    gap: var(--gap-xs);
  }

  @include for-mobile {
    .trakt-profile-history-summary {
      height: var(--ni-168);
    }
    .trakt-profile-history-content {
      flex-direction: column;
    }
  }
</style>
