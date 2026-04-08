<script lang="ts">
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import ExternalLinkAction from "../../../_internal/ExternalLinkAction.svelte";

  const { person }: { person: PersonSummary } = $props();

  const facebookUsername = $derived(person.socialMedia?.facebook);
  const xUsername = $derived(person.socialMedia?.x);
  const instagramUsername = $derived(person.socialMedia?.instagram);

  const hasSocialMediaLinks = $derived(
    facebookUsername || xUsername || instagramUsername,
  );

  const source = "person-summary";
</script>

{#if hasSocialMediaLinks}
  {#if facebookUsername}
    <ExternalLinkAction id={facebookUsername} type="facebook" {source} />
  {/if}

  {#if xUsername}
    <ExternalLinkAction id={xUsername} type="x" {source} />
  {/if}

  {#if instagramUsername}
    <ExternalLinkAction id={instagramUsername} type="instagram" {source} />
  {/if}
{/if}
