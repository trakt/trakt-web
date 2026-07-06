<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import { settingsPages } from "./settingsPages.ts";

  const { onNavigate }: { onNavigate?: () => void } = $props();

  type SettingsPage = (typeof settingsPages)[number];
</script>

{#snippet pageLink(page: SettingsPage)}
  <Link
    href={page.href}
    activeMatch={page.nested ? "nested" : "exact"}
    onclick={onNavigate}
  >
    <span class="title">{page.label()}</span>
  </Link>
{/snippet}

<div class="trakt-settings-links">
  {#each settingsPages as page (page.href)}
    {#if page.flag}
      <RenderForFeature flag={page.flag}>
        {#snippet enabled()}
          {@render pageLink(page)}
        {/snippet}
      </RenderForFeature>
    {:else}
      {@render pageLink(page)}
    {/if}
  {/each}
</div>

<style lang="scss">
  .trakt-settings-links {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    span.title {
      color: var(--color-text-secondary);

      transition: color var(--transition-increment) ease-in-out;
    }

    :global(.trakt-link) {
      display: block;
      padding: var(--ni-10) var(--ni-12);

      border-radius: var(--border-radius-m);

      text-decoration: none;

      transition: background-color var(--transition-increment) ease-in-out;
    }

    :global(.trakt-link.trakt-link-active) {
      background-color: var(--purple-500);

      :global(span.title) {
        color: var(--shade-10);
      }
    }
  }
</style>
