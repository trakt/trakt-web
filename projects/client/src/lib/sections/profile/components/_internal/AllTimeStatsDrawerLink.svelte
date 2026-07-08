<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { profileDrawerNavigation } from "../../_internal/profileDrawerNavigation.ts";
  import type { AllTimeStatsDrawerLinkProps } from "./AllTimeStatsDrawerLinkProps.ts";

  const { variant = "button" }: AllTimeStatsDrawerLinkProps = $props();

  const { buildAllTimeStatsDrawerLink } = profileDrawerNavigation();
</script>

<div class="trakt-all-time-stats-drawer-link">
  {#if variant === "link"}
    <Link {...buildAllTimeStatsDrawerLink()} color="inherit">
      <ClockIcon />
      <p class="bold">{m.button_text_all_time_stats()}</p>
    </Link>
  {:else}
    <Button
      {...buildAllTimeStatsDrawerLink()}
      label={m.button_label_all_time_stats()}
      size="small"
    >
      <p class="capitalize">{m.button_text_all_time_stats()}</p>
      {#snippet icon()}
        <CaretRightIcon />
      {/snippet}
    </Button>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-all-time-stats-drawer-link {
    display: flex;

    :global(.trakt-link) {
      text-decoration: none;

      display: flex;
      align-items: center;
      gap: var(--gap-xs);

      color: inherit;
    }

    @include card-outline-button(".trakt-button-link");

    :global(svg) {
      width: var(--ni-18);
      height: var(--ni-18);
    }
  }
</style>
