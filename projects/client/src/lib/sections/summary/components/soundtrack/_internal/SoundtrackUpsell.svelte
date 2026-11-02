<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import UpsellCta from "$lib/features/upsell/UpsellCta.svelte";
  import SoundtrackTrackRow from "./SoundtrackTrackRow.svelte";
  import { teaserTracks } from "./teaserTracks.ts";
</script>

<div class="trakt-soundtrack-upsell">
  <ul class="upsell-list" aria-hidden="true">
    {#each teaserTracks as track, index (track.key)}
      <SoundtrackTrackRow
        {track}
        number={index + 1}
        isPlaying={false}
        onPlay={() => {}}
      />
    {/each}
  </ul>

  <UpsellCta source="soundtrack" title={m.text_soundtrack_upsell()}>
    {m.vip_feature_description_soundtrack()}
  </UpsellCta>
</div>

<style lang="scss">
  .trakt-soundtrack-upsell {
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
