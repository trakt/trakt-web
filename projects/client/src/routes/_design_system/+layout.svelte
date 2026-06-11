<script lang="ts">
  import { page } from "$app/state";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import DesignSystemThemeToggle from "./_internal/DesignSystemThemeToggle.svelte";
  import {
    DESIGN_SYSTEM_GROUPS,
    findDesignSystemPage,
  } from "./_internal/designSystemPages.ts";

  const { children } = $props();

  const activePage = $derived(findDesignSystemPage(page.url.pathname));
  const metaInfo = $derived(activePage?.title ?? "Index");
</script>

<svelte:head>
  <title>Trakt Web: Design System</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#snippet actions()}
  <DesignSystemThemeToggle />
{/snippet}

<NavbarStateSetter
  mode="full"
  showFilters={false}
  {actions}
  header={{
    title: "Design System",
    metaInfo,
  }}
/>

<div class="trakt-design-system-route">
  <div class="trakt-design-system-shell">
    <nav class="trakt-design-system-menu" aria-label="Design system pages">
      {#each DESIGN_SYSTEM_GROUPS as group}
        <div
          class="trakt-design-system-menu-section"
          aria-labelledby={`${group.id}-design-system-section`}
        >
          <p
            id={`${group.id}-design-system-section`}
            class="tag secondary uppercase"
          >
            {group.title}
          </p>

          <div class="trakt-design-system-menu-links">
            {#each group.pages as designSystemPage}
              <a
                href={designSystemPage.href}
                class:is-active={designSystemPage.href === page.url.pathname}
                aria-current={designSystemPage.href === page.url.pathname
                  ? "page"
                  : undefined}
              >
                {designSystemPage.title}
              </a>
            {/each}
          </div>
        </div>
      {/each}
    </nav>

    <div class="trakt-design-system-content">
      {@render children()}
    </div>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-design-system-route {
    box-sizing: border-box;
    min-height: 100vh;
    padding-left: var(--layout-sidebar-distance);
    margin-top: calc(var(--gap-m) + env(safe-area-inset-top));

    transition: var(--transition-increment) ease-in-out;
    transition-property: margin, padding;

    @include for-tablet-sm-and-below {
      padding-left: 0;
      margin-top: var(--gap-m);
    }

    @include for-mobile {
      margin-top: var(--gap-xxs);
    }
  }

  .trakt-design-system-shell {
    display: grid;
    grid-template-columns: minmax(var(--ni-180), var(--ni-220)) minmax(0, 1fr);
    align-items: start;
    gap: var(--gap-xxl);

    margin: 0 var(--layout-distance-side);
    padding-block: var(--ni-32);

    @include for-tablet-lg {
      grid-template-columns:
        minmax(var(--ni-160), var(--ni-200))
        minmax(0, 1fr);
      gap: var(--gap-l);
    }

    @include for-tablet-sm-and-below {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--gap-l);
      padding-block: var(--ni-20);
    }
  }

  .trakt-design-system-menu {
    --design-system-menu-top: calc(
      var(--navbar-actions-bottom, env(safe-area-inset-top, 0px)) + var(--gap-m)
    );

    position: sticky;
    top: var(--design-system-menu-top);

    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
    min-width: 0;
    max-height: calc(100dvh - var(--design-system-menu-top) - var(--gap-m));
    overflow-y: auto;

    @include for-tablet-sm-and-below {
      position: static;
      max-height: none;
      overflow: visible;
    }
  }

  .trakt-design-system-menu-section,
  .trakt-design-system-menu-links {
    display: flex;
    flex-direction: column;
  }

  .trakt-design-system-menu-section {
    gap: var(--gap-xs);

    p {
      margin: 0;
    }
  }

  .trakt-design-system-menu-links {
    gap: var(--ni-2);
  }

  .trakt-design-system-menu a {
    display: flex;
    align-items: center;

    min-height: var(--ni-36);
    padding: 0 var(--ni-12);
    border-radius: var(--border-radius-m);

    color: var(--color-text-primary);
    text-decoration: none;

    transition: var(--transition-increment) ease-in-out;
    transition-property: background-color, color;

    &.is-active {
      color: var(--color-link-active);
      background-color: color-mix(
        in srgb,
        var(--color-link-active) 14%,
        transparent
      );
    }

    @include for-mouse {
      &:hover {
        color: var(--color-link-active);
        background-color: color-mix(
          in srgb,
          var(--color-link-active) 10%,
          transparent
        );
      }
    }
  }

  .trakt-design-system-content {
    min-width: 0;
  }
</style>
