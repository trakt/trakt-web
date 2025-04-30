<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { createUnderlay } from "$lib/features/portal/_internal/createUnderlay";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { GlobalEventBus } from "$lib/utils/events/GlobalEventBus";
  import { onMount } from "svelte";
  import { type Writable } from "svelte/store";
  import { slide } from "svelte/transition";

  type SidebarProps = {
    isOpen: Writable<boolean>;
    title: string;
  } & ChildrenProps;

  const { children, isOpen, title }: SidebarProps = $props();

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const slideAxis = $derived($isMobile ? "y" : "x");

  // FIXME extract simplified version from usePortal and re-use here
  const portal = (element: HTMLElement) => {
    const closeSidebar = () => {
      isOpen.set(false);
    };

    onMount(() => {
      const instance = GlobalEventBus.getInstance();
      const newUnderlay = createUnderlay();

      document.body.appendChild(newUnderlay);
      document.body.appendChild(element);

      newUnderlay.addEventListener("click", closeSidebar);
      const destroyScroll = instance.register("scroll", closeSidebar);

      return () => {
        newUnderlay.removeEventListener("click", closeSidebar);
        destroyScroll();
        newUnderlay.remove();
      };
    });
  };
</script>

{#if $isOpen}
  <div
    class="trakt-sidebar"
    transition:slide={{ duration: 150, axis: slideAxis }}
    use:portal
  >
    <div class="trakt-sidebar-header">
      {title}
      <ActionButton
        onclick={() => isOpen.set(false)}
        label={m.close_label()}
        style="ghost"
        --color-foreground-default="var(--color-text-secondary)"
      >
        <CloseIcon />
      </ActionButton>
    </div>
    <div class="trakt-sidebar-content">
      {@render children()}
    </div>
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-sidebar {
    --sidebar-size: var(--ni-300);

    z-index: var(--layer-menu);
    position: fixed;
    box-sizing: border-box;

    top: 0;
    bottom: 0;
    right: 0;

    width: var(--sidebar-size);
    padding: var(--ni-16);
    padding-bottom: calc(var(--ni-16) + env(safe-area-inset-bottom, 0));

    background: color-mix(
      in srgb,
      var(--color-background) 88%,
      transparent 12%
    );
    backdrop-filter: blur(var(--ni-12));

    box-shadow: var(--ni-0) var(--ni-8) var(--ni-8) var(--ni-0)
      color-mix(in srgb, var(--color-shadow) 25%, transparent 75%);

    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    border-top-left-radius: var(--border-radius-m);
    border-bottom-left-radius: var(--border-radius-m);

    @include for-mobile {
      top: initial;
      left: 0;

      border-bottom-left-radius: initial;
      border-top-right-radius: var(--border-radius-m);

      width: initial;
      height: var(--sidebar-size);

      box-shadow: var(--ni-8) var(--ni-0) var(--ni-8) var(--ni-0)
        color-mix(in srgb, var(--color-shadow) 25%, transparent 75%);
    }
  }

  .trakt-sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .trakt-sidebar-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    overflow-y: auto;
  }
</style>
