<script lang="ts">
  const { posters }: { posters: ReadonlyArray<string | null> } = $props();
</script>

<div class="yir-reel-posters" aria-hidden="true">
  {#each posters as poster, index (index)}
    <i
      class:is-hero={index === 0}
      style:--k={index}
      style:--dx="{((index * 37) % 9) - 4}"
      style:--dy="{((index * 53) % 7) - 3}"
    >
      {#if poster}
        <img src={poster} alt="" loading="lazy" />
      {/if}
    </i>
  {/each}
</div>

<style lang="scss">
  .yir-reel-posters {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--ni-8);
    width: min(88%, var(--ni-380));

    i {
      position: relative;
      aspect-ratio: 2 / 3;
      border-radius: var(--border-radius-s);
      overflow: hidden;
      background: linear-gradient(
        160deg,
        var(--color-yir-accent),
        var(--color-yir-surface-chip)
      );
      transform: translate(
          calc(var(--dx) * (1 - var(--p)) * var(--ni-64)),
          calc(var(--dy) * (1 - var(--p)) * var(--ni-80))
        )
        rotate(calc(var(--dx) * (1 - var(--p)) * 12deg));
      opacity: calc(var(--p) * 1.8);

      &.is-hero {
        outline: var(--ni-2) solid var(--color-yir-text-primary);
        outline-offset: var(--ni-2);
      }
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
</style>
