<script lang="ts">
  import ExternalLinkAction from "$lib/sections/summary/components/_internal/ExternalLinkAction.svelte";
  import type { SocialMediaLink } from "./SocialMediaLink";

  const { links }: { links: SocialMediaLink[] } = $props();

  const source = "person-summary";
</script>

{#each links as link (link.type)}
  <ExternalLinkAction {...link} {source} />
{/each}
