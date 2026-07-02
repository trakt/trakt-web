<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import { fade } from "svelte/transition";
  import MediaDetails from "./_internal/MediaDetails.svelte";
  import MediaLinks from "./_internal/MediaLinks.svelte";
  import MediaParentalGuide from "./_internal/MediaParentalGuide.svelte";
  import MediaStats from "./_internal/MediaStats.svelte";
  import type { MediaDetailsProps } from "./MediaDetailsProps";

  const { onClose, ...props }: { onClose: () => void } & MediaDetailsProps =
    $props();

  let isOpen = $state(false);

  const imdbId = $derived(
    props.type === "episode" ? props.episode.imdbId : props.media.imdbId,
  );
</script>

<Drawer
  {onClose}
  onOpened={() => (isOpen = true)}
  title={m.header_details()}
  size="auto"
>
  {#if isOpen}
    <div
      class="trakt-details-drawer-content"
      transition:fade={{ duration: 150 }}
    >
      <MediaStats {...props} />
      <MediaDetails {...props} />

      {#if props.type !== "episode"}
        <MediaLinks media={props.media} />
      {/if}

      <RenderForFeature flag={FeatureFlag.ParentalGuide} audience="director">
        {#snippet enabled()}
          <MediaParentalGuide {imdbId} />
        {/snippet}
      </RenderForFeature>
    </div>
  {/if}
</Drawer>

<style>
  .trakt-details-drawer-content {
    --details-gap: var(--gap-l);

    display: flex;
    flex-direction: column;
    gap: var(--details-gap);
  }

  .trakt-details-drawer-content :global(
    .trakt-media-links + .trakt-media-parental-guide
  ) {
    margin-top: calc(-1 * var(--details-gap));

    border-top: none;
  }
</style>
