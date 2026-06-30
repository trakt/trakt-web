<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import type { YirMostWatchedItem } from "$lib/requests/models/YirDetail";
  import Yir2024MostPlayedCard from "./Yir2024MostPlayedCard.svelte";

  const {
    type,
    items,
  }: {
    type: "shows" | "movies";
    items: YirMostWatchedItem[];
  } = $props();

  const heading = $derived(
    type === "shows"
      ? m.yir_2024_most_watched_shows()
      : m.yir_2024_most_watched_movies(),
  );
</script>

<section class="trakt-yir-2024-most-played-section" id="section-{type}-most-watched">
  <header class="yir-2024-most-played-header">
    <h2 class="bold yir-2024-most-played-heading">{heading}</h2>
  </header>

  <ol class="yir-2024-most-played-stack">
    {#each items as item, index (item.entry.id)}
      <Yir2024MostPlayedCard {item} rank={index + 1} />
    {/each}
  </ol>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-2024-most-played-section {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--ni-32);

    @include for-mobile {
      gap: var(--ni-20);
    }
  }

  .yir-2024-most-played-header {
    padding-inline: var(--ni-12);
  }

  .yir-2024-most-played-heading {
    margin: 0;
    font-size: clamp(var(--ni-28), 3.5vw, var(--ni-44));
    color: var(--color-yir-text-primary);

    @include for-mobile {
      font-size: var(--ni-22);
    }
  }

  // Ordered list for ranked semantics (screen readers announce "1 of 10").
  // Reset the browser defaults so the list lays out with our own gap-driven
  // flex column.
  .yir-2024-most-played-stack {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ni-24);

    @include for-mobile {
      gap: var(--ni-16);
    }
  }
</style>
