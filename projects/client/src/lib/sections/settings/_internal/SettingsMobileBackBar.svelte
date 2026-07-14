<script lang="ts">
  import { page } from "$app/state";
  import CaretLeftIcon from "$lib/components/icons/CaretLeftIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { activeSettingsPageTitle } from "./activeSettingsPageTitle.ts";

  const hubHref = UrlBuilder.settings.general();
  const isHub = $derived(page.url.pathname === hubHref);
  const activeTitle = $derived(activeSettingsPageTitle(page.url.pathname));
</script>

{#if !isHub}
  <div class="trakt-settings-mobile-back-bar">
    <Link href={hubHref} color="inherit" label={activeTitle}>
      <span class="back-icon"><CaretLeftIcon /></span>
      <span class="back-label bold ellipsis">{activeTitle}</span>
    </Link>
  </div>
{/if}

<style lang="scss">
  .trakt-settings-mobile-back-bar {
    display: flex;

    color: var(--color-text-primary);

    :global(.trakt-link) {
      display: flex;
      align-items: center;
      gap: var(--gap-xs);
      min-width: 0;

      text-decoration: none;
      -webkit-tap-highlight-color: transparent;

      transition: color var(--transition-increment) ease-in-out;
    }

    :global(.trakt-link:active) {
      color: var(--color-link-active);
    }
  }

  .back-icon {
    flex-shrink: 0;

    display: flex;
    align-items: center;
    color: var(--color-text-secondary);

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }

  .back-label {
    min-width: 0;

    font-size: var(--font-size-title);
  }
</style>
