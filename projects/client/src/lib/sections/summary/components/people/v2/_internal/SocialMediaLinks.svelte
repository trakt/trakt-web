<script lang="ts">
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import SummaryActions from "../../../_internal/SummaryActions.svelte";
  import SocialMediaAction from "./SocialMediaAction.svelte";

  const { person }: { person: PersonSummary } = $props();

  const facebookUsername = $derived(person.socialMedia?.facebook);
  const xUsername = $derived(person.socialMedia?.x);
  const instagramUsername = $derived(person.socialMedia?.instagram);
</script>

<trakt-social-media-links>
  <SummaryActions>
    {#if facebookUsername}
      <SocialMediaAction username={facebookUsername} type="facebook" />
    {/if}

    {#if xUsername}
      <SocialMediaAction username={xUsername} type="x" />
    {/if}

    {#if instagramUsername}
      <SocialMediaAction username={instagramUsername} type="instagram" />
    {/if}
  </SummaryActions>
</trakt-social-media-links>

<style>
  trakt-social-media-links {
    :global(.trakt-summary-actions) {
      justify-content: center;
      gap: var(--gap-l);

      :global(svg) {
        height: var(--ni-24);
        width: auto;
      }
    }
  }
</style>
