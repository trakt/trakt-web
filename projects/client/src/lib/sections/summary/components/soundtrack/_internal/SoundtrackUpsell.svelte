<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import UpsellCta from "$lib/features/upsell/UpsellCta.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import SoundtrackTrackRow from "./SoundtrackTrackRow.svelte";
  import { teaserTracks } from "./teaserTracks.ts";
</script>

{#snippet teaser()}
  <section class="trakt-soundtrack-upsell">
    <h2 class="upsell-heading">{m.list_title_soundtrack()}</h2>

    <div class="upsell-board">
      <ul class="upsell-list" aria-hidden="true">
        {#each teaserTracks as track (track.key)}
          <SoundtrackTrackRow {track} isPlaying={false} onPlay={() => {}} />
        {/each}
      </ul>

      <UpsellCta source="soundtrack" title={m.text_soundtrack_upsell()}>
        {m.vip_feature_description_soundtrack()}
      </UpsellCta>
    </div>
  </section>
{/snippet}

<!-- `free` is signed-in non-VIP, `public` is signed out. The endpoint returns
     an empty list for both, so neither may be shown a section that reads as
     "this title has no soundtrack". -->
<RenderFor audience="free">
  {@render teaser()}
</RenderFor>

<RenderFor audience="public">
  {@render teaser()}
</RenderFor>

<style lang="scss">
  .trakt-soundtrack-upsell {
    display: flex;
    flex-direction: column;
    gap: var(--list-header-gap);

    padding-inline: var(--layout-distance-side);
  }

  .upsell-heading {
    margin: 0;
  }

  .upsell-board {
    display: flex;
    flex-direction: column;
    gap: var(--ni-12);
  }

  .upsell-list {
    margin: 0;
    padding: 0;
    overflow: hidden;

    list-style: none;

    background-color: var(--color-card-background);
    border-radius: var(--border-radius-m);
    box-shadow: var(--shadow-base);

    /* The rows are a sample, not this title's data - blurred so they read as
       a preview of the feature rather than as real credits. */
    filter: blur(var(--ni-4));
    user-select: none;
    pointer-events: none;
  }
</style>
