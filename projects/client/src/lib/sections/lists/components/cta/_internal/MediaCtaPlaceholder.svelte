<script lang="ts">
  import type { CtaItemIntl } from "../CtaItemIntl";
  import ReleasedIcon from "../icons/ReleasedIcon.svelte";
  import UpcomingIcon from "../icons/UpcomingIcon.svelte";
  import UpNextIcon from "../icons/UpNextIcon.svelte";
  import type { MediaCta } from "../models/Cta";
  import PlaceholderItem from "./PlaceholderItem.svelte";

  const {
    cta,
    intl,
  }: {
    cta: MediaCta;
    intl: CtaItemIntl;
  } = $props();
</script>

{#snippet ctaIcon()}
  {#if cta.type === "up-next" || cta.type === "personal-activity"}
    <UpNextIcon />
  {/if}

  {#if cta.type === "released" || cta.type === "watchlist" || cta.type === "favorites"}
    <ReleasedIcon />
  {/if}

  {#if cta.type === "upcoming"}
    <UpcomingIcon />
  {/if}
{/snippet}

<PlaceholderItem {cta} {intl}>
  {#snippet icon()}
    {@render ctaIcon()}
  {/snippet}
</PlaceholderItem>
