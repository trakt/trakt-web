<script lang="ts">
  import ArrowRightIcon from "$lib/components/icons/ArrowRightIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { NextStepsPage } from "$lib/features/next-steps/NextStepsPage.ts";
  import {
    DashboardDrawers,
    dashboardDrawerNavigation,
  } from "./dashboardDrawerNavigation.ts";
  import NextStepsRing from "./NextStepsRing.svelte";

  const { page }: { page: NextStepsPage } = $props();

  const { buildDrawerLink } = dashboardDrawerNavigation();
  const drawerLink = $derived(buildDrawerLink(DashboardDrawers.NextSteps));
</script>

<div class="trakt-next-steps-callout">
  <Link
    {...drawerLink}
    label={m.button_label_open_next_steps({
      completed: page.completed,
      total: page.total,
    })}
  >
    <div class="next-steps-card">
      <NextStepsRing completed={page.completed} total={page.total} />
      <p class="bold ellipsis next-steps-title">{m.header_next_steps()}</p>
      <div class="next-steps-arrow">
        <ArrowRightIcon />
      </div>
    </div>
  </Link>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-next-steps-callout {
    margin-inline: var(--layout-distance-side);

    :global(.trakt-link) {
      display: block;
      text-decoration: none;
    }
  }

  .next-steps-card {
    box-sizing: border-box;
    min-height: var(--ni-74);

    display: flex;
    align-items: center;
    gap: var(--gap-l);

    padding: var(--ni-12);
    padding-inline-end: var(--ni-18);

    background: var(--color-streak-surface);
    border-radius: var(--border-radius-l);
    box-shadow: var(--shadow-floating);

    @include for-tablet-sm-and-below {
      gap: var(--gap-s);
    }
  }

  .next-steps-title {
    flex: 1;
    min-width: 0;
    font-size: var(--font-size-title);
  }

  .next-steps-arrow {
    display: flex;
    flex-shrink: 0;
    color: var(--color-text-secondary);

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }
</style>
