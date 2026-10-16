<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { MovieEntry } from "$lib/requests/models/MovieEntry.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import { toPickedLine } from "./toPickedLine.ts";

  const { picked }: { picked: ReadonlyArray<MovieEntry | ShowEntry> } =
    $props();
</script>

<div class="trakt-mixtape-picks">
  {#each picked as media (media.id)}
    <div class="picks-poster">
      <CrossOriginImage src={media.poster.url.thumb} alt={media.title} />
    </div>
  {/each}
  <p class="small secondary">
    {toPickedLine(picked.map(({ title }) => title))}
  </p>
</div>

<style lang="scss">
  .trakt-mixtape-picks {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    p {
      margin: 0;
    }
  }

  .picks-poster {
    flex: none;
    width: var(--width-mixtape-pick, var(--ni-40));
    aspect-ratio: 2 / 3;
    overflow: hidden;
    border-radius: var(--border-radius-xs);

    :global(img) {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
</style>
