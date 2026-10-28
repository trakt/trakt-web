<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { fade } from "svelte/transition";
  import MediaAwards from "./_internal/MediaAwards.svelte";
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

  /* The header clamps the description to two lines; this is where it unrolls. */
  const overview = $derived(
    props.type === "episode" ? props.episode.overview : props.media.overview,
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
      {#if overview}
        <p class="details-overview">{overview}</p>
      {/if}

      <MediaStats {...props} />
      <MediaDetails {...props} />

      {#if props.type !== "episode"}
        <RenderForFeature flag={FeatureFlag.SummaryAwards} audience="director">
          {#snippet enabled()}
            <MediaAwards slug={props.media.slug} />
          {/snippet}
        </RenderForFeature>

        <MediaLinks media={props.media} />

        <MediaParentalGuide type={props.type} slug={props.media.slug} />
      {/if}
    </div>
  {/if}
</Drawer>

<style lang="scss">
  .details-overview {
    margin: 0;

    color: var(--color-text-secondary);
    font-size: var(--font-size-text);
    line-height: 1.6;
  }

  .trakt-details-drawer-content {
    display: flex;
    flex-direction: column;
    gap: var(--ni-20);

    /* The redesigned drawers' shared supplemental inset. */
    padding: var(--gap-xs) var(--gap-s) var(--gap-s);

    /*
      One rule draws every band boundary, so no child needs its own borders
      - which is what previously forced the negative-margin handshake between
      the links block and the parental guide.
    */
    > :global(* + *) {
      padding-top: var(--ni-20);
      border-top: var(--ni-1) solid var(--color-hairline);
    }

    /*
      The stats sit on their own panels, and the panels already do the
      separating - a hairline on either side of them would double the chrome.
      The bands resume from the section after the next.
    */
    > :global(.trakt-media-stats),
    > :global(.trakt-media-stats + *) {
      padding-top: 0;
      border-top: none;
    }
  }
</style>
