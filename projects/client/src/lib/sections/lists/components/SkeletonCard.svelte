<script lang="ts">
  import LandscapeCard from "$lib/components/media/card/LandscapeCard.svelte";
  import PortraitCard from "$lib/components/media/card/PortraitCard.svelte";

  const {
    variant = "portrait",
    index,
    listIndex,
  }: {
    variant?: "portrait" | "landscape";
    index: number;
    listIndex: number;
  } = $props();
</script>

{#snippet placeholderContent()}
  <div
    class="trakt-skeleton-card-content"
    style="--index: {index}; --list-index: {listIndex}"
  >
    <div class="trakt-skeleton-card-cover"></div>
    <div class="trakt-skeleton-card-footer"></div>
  </div>
{/snippet}

{#if variant === "portrait"}
  <PortraitCard>
    {@render placeholderContent()}
  </PortraitCard>
{/if}

{#if variant === "landscape"}
  <LandscapeCard>
    {@render placeholderContent()}
  </LandscapeCard>
{/if}

<style>
  .trakt-skeleton-card-cover,
  .trakt-skeleton-card-footer {
    background: var(--color-card-background);

    border-radius: var(--border-radius-m);

    position: relative;
    overflow: hidden;

    box-shadow: var(--shadow-base);
  }

  .trakt-skeleton-card-cover {
    width: var(--width-card);
    height: var(--height-card-cover);
  }

  .trakt-skeleton-card-footer {
    width: calc(var(--width-card) * 0.5);
    height: var(--ni-12);

    padding: var(--ni-4) var(--ni-8);
    margin-top: var(--ni-8);
  }

  .trakt-skeleton-card-content {
    /* Factor of 10, since the animation should span all cards */
    --animation-duration: calc(10 * var(--transition-increment));
    /* Magic constant factor to make it seem as if it goes from card to card */
    --delay-factor: 0.075;

    /* Start delay to not have all lists start at the same time */
    --start-delay: calc(var(--animation-duration) / var(--list-index));

    --animation-loop-delay: var(--delay-factor) * var(--animation-duration) *
      var(--index);
  }

  .trakt-skeleton-card-cover::after,
  .trakt-skeleton-card-footer::after {
    content: "";

    position: absolute;
    top: 0;

    width: 300%;
    height: 100%;

    transform: translateX(100%);

    animation: slide var(--animation-duration) infinite;
    animation-delay: calc(var(--start-delay) + var(--animation-loop-delay));

    background: linear-gradient(
      110deg,
      var(--color-card-background) 0%,
      var(--color-card-background) 30%,
      color-mix(in srgb, var(--color-foreground) 50%, transparent) 50%,
      var(--color-card-background) 70%,
      var(--color-card-background) 100%
    );

    opacity: 0.2;
  }
</style>
