<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import type { DrawerLinkProps } from "$lib/components/media/tags/DrawerLinkProps.ts";
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import type { Snippet } from "svelte";

  const {
    icon,
    label,
    link,
  }: {
    icon?: Snippet;
    label: string;
    link?: DrawerLinkProps;
  } = $props();
</script>

{#snippet tag()}
  <StemTag
    {icon}
    --color-background-stem-tag="var(--color-background-indicator-tag)"
    --color-foreground-stem-tag="var(--color-text-indicator-tag)"
  >
    <p class="bold uppercase no-wrap">{label}</p>
  </StemTag>
{/snippet}

<stem-link-tag>
  {#if link}
    <Link {...link}>
      {@render tag()}
    </Link>
  {:else}
    {@render tag()}
  {/if}
</stem-link-tag>

<style>
  stem-link-tag :global(.trakt-link) {
    text-decoration: none;
  }
</style>
