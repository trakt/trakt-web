<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const {
    entries,
  }: {
    entries: MediaEntry[];
  } = $props();
</script>

{#if entries.length > 0}
  <div class="yir-2024-posters-row">
    {#each entries as entry (entry.key)}
      <a
        href={UrlBuilder.media(entry.type, entry.slug)}
        class="yir-2024-poster"
        aria-label={entry.title}
      >
        <CrossOriginImage src={entry.poster.url.medium} alt={entry.title} />
      </a>
    {/each}
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .yir-2024-posters-row {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: var(--gap-m);
    margin-top: var(--ni-48);

    .yir-2024-poster:nth-child(2),
    .yir-2024-poster:nth-child(5) {
      transform: translateY(var(--ni-neg-48));
    }

    .yir-2024-poster:nth-child(4) {
      transform: translateY(var(--ni-neg-24));
    }

    &:hover .yir-2024-poster :global(img) {
      filter: saturate(20%);
    }

    .yir-2024-poster:hover :global(img) {
      filter: saturate(100%);
    }

    @include for-tablet-lg-and-below {
      gap: var(--gap-s);
    }

    @include for-tablet-sm-and-below {
      flex-wrap: nowrap;
      gap: var(--gap-xs);
    }

    @include for-mobile {
      gap: var(--ni-6);

      // Mobile: drop posters 3 + 6 (keeping 2 shows + 2 movies, balanced
      // across the wave) and shrink the stagger so the row reads cleanly
      // at narrow widths.
      .yir-2024-poster:nth-child(3),
      .yir-2024-poster:nth-child(6) {
        display: none;
      }

      .yir-2024-poster:nth-child(2),
      .yir-2024-poster:nth-child(5) {
        transform: translateY(var(--ni-neg-20));
      }

      .yir-2024-poster:nth-child(4) {
        transform: translateY(var(--ni-neg-10));
      }
    }
  }

  .yir-2024-poster {
    flex: 0 1 var(--ni-220);
    width: var(--ni-220);
    aspect-ratio: 2 / 3;
    border-radius: var(--border-radius-m);
    overflow: hidden;
    transition: transform 0.3s;
    background-color: var(--shade-800);

    &:hover {
      transform: scale(1.05);
    }

    // Translate-Y wins over hover scale by default (last-cascading rule), so
    // wave-shifted children compose translateY + scale on hover.
    &:nth-child(2):hover,
    &:nth-child(5):hover {
      transform: translateY(var(--ni-neg-48)) scale(1.05);
    }

    &:nth-child(4):hover {
      transform: translateY(var(--ni-neg-24)) scale(1.05);
    }

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: filter 0.3s;
    }

    @include for-tablet-lg-and-below {
      flex-basis: var(--ni-180);
      width: var(--ni-180);
    }

    @include for-tablet-sm-and-below {
      flex-basis: 0;
      flex-grow: 1;
      flex-shrink: 1;
      min-width: 0;
      width: auto;
    }

    // Mobile hover-stagger overrides matching the smaller mobile offsets.
    @include for-mobile {
      &:nth-child(2):hover,
      &:nth-child(5):hover {
        transform: translateY(var(--ni-neg-20)) scale(1.05);
      }

      &:nth-child(4):hover {
        transform: translateY(var(--ni-neg-10)) scale(1.05);
      }
    }
  }
</style>
