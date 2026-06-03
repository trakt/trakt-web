<script lang="ts">
  import TrackIcon from "$lib/components/icons/TrackIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import {
    SummaryDrawers,
    summaryDrawerNavigation,
  } from "../../_internal/summaryDrawerNavigation.ts";

  const { buildDrawerLink } = summaryDrawerNavigation();
</script>

<started-tag>
  <Link {...buildDrawerLink(SummaryDrawers.Seasons)}>
    <StemTag
      --color-background-stem-tag="var(--color-background-indicator-tag)"
      --color-foreground-stem-tag="var(--color-text-indicator-tag)"
    >
      <TrackIcon />

      <p class="bold uppercase no-wrap">{m.tag_text_started()}</p>
    </StemTag>
  </Link>
</started-tag>

<style>
  started-tag {
    :global(.trakt-tag) {
      position: relative;

      :global(svg) {
        width: var(--ni-12);
        height: var(--ni-12);
      }
    }

    :global(.trakt-link) {
      text-decoration: none;
    }
  }
</style>
