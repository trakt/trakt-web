<script lang="ts">
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import SocialMediaAction from "./SocialMediaAction.svelte";

  const { person }: { person: PersonSummary } = $props();

  const facebookUsername = $derived(person.socialMedia?.facebook);
  const xUsername = $derived(person.socialMedia?.x);
  const instagramUsername = $derived(person.socialMedia?.instagram);

  const hasSocialMediaLinks = $derived(
    facebookUsername || xUsername || instagramUsername,
  );
</script>

{#if hasSocialMediaLinks}
  {#if facebookUsername}
    <SocialMediaAction username={facebookUsername} type="facebook" />
  {/if}

  {#if xUsername}
    <SocialMediaAction username={xUsername} type="x" />
  {/if}

  {#if instagramUsername}
    <SocialMediaAction username={instagramUsername} type="instagram" />
  {/if}
{/if}
