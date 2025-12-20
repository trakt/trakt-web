<script lang="ts">
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import SummaryActionsBar from "../../../_internal/SummaryActionsBar.svelte";
  import SocialMediaAction from "./SocialMediaAction.svelte";

  const {
    person,
    variant = "default",
  }: { person: PersonSummary; variant?: "default" | "compact" } = $props();

  const facebookUsername = $derived(person.socialMedia?.facebook);
  const xUsername = $derived(person.socialMedia?.x);
  const instagramUsername = $derived(person.socialMedia?.instagram);

  const hasSocialMediaLinks = $derived(
    facebookUsername || xUsername || instagramUsername,
  );
</script>

<trakt-social-media-links data-variant={variant}>
  {#if hasSocialMediaLinks}
    <SummaryActionsBar>
      {#if facebookUsername}
        <SocialMediaAction username={facebookUsername} type="facebook" />
      {/if}

      {#if xUsername}
        <SocialMediaAction username={xUsername} type="x" />
      {/if}

      {#if instagramUsername}
        <SocialMediaAction username={instagramUsername} type="instagram" />
      {/if}
    </SummaryActionsBar>
  {/if}
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

    &[data-variant="compact"] {
      :global(.trakt-summary-actions) {
        width: fit-content;
      }
    }
  }
</style>
