<script lang="ts">
  import { afterNavigate } from "$app/navigation";
  import { page } from "$app/state";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import MenuIcon from "$lib/components/icons/MenuIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { writable } from "$lib/utils/store/WritableSubject";
  import { activeSettingsPageTitle } from "./activeSettingsPageTitle.ts";
  import SettingsNavLinks from "./SettingsNavLinks.svelte";

  const isOpen = writable(false);
  const activeTitle = $derived(activeSettingsPageTitle(page.url.pathname));

  const close = () => isOpen.set(false);

  afterNavigate(() => close());
</script>

<button
  class="trakt-settings-nav-trigger"
  type="button"
  aria-label={m.page_title_settings()}
  onclick={() => isOpen.set(true)}
>
  <span class="title bold ellipsis">{activeTitle}</span>
  <span class="trigger-icon"><MenuIcon /></span>
</button>

{#if $isOpen}
  <Drawer onClose={close} title={m.page_title_settings()} size="auto">
    <SettingsNavLinks onNavigate={close} />
  </Drawer>
{/if}

<style lang="scss">
  .trakt-settings-nav-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-s);

    width: 100%;
    box-sizing: border-box;
    padding: var(--gap-s) var(--gap-m);

    border: none;
    border-radius: var(--border-radius-l);
    background: var(--color-card-background);
    color: var(--color-text-primary);
    box-shadow: var(--shadow-base);

    cursor: pointer;
    text-align: start;
    -webkit-tap-highlight-color: transparent;
  }

  .title {
    min-width: 0;

    font-size: var(--font-size-title);
  }

  .trigger-icon {
    flex-shrink: 0;

    display: flex;
    align-items: center;
    color: var(--color-text-secondary);

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }
  }
</style>
