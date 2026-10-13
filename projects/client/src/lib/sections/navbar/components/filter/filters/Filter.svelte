<script lang="ts">
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import FilterSettings from "./FilterSettings.svelte";
  import type { FilterSettingsSlot } from "./FilterSettingsSlot.ts";

  const {
    title,
    settings,
    children,
    variant = "default",
  }: {
    title: string;
    settings?: FilterSettingsSlot;
    variant?: "default" | "inline" | "compact";
  } & ChildrenProps = $props();
</script>

<div
  class="trakt-filter"
  data-dpad-navigation={DpadNavigationType.List}
  data-variant={variant}
>
  {#snippet heading()}
    <span class:secondary={variant === "inline"}>{title}</span>
  {/snippet}

  {#if settings}
    <div class="trakt-filter-title">
      {@render heading()}
      <FilterSettings label={title} {...settings} />
    </div>
    <div class="trakt-filter-control">
      {@render children()}
    </div>
  {:else}
    {@render heading()}
    {@render children()}
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-filter {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    min-width: 0;

    &[data-variant="inline"] {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: var(--gap-s);

      width: 100%;
      min-height: var(--ni-40);
      box-sizing: border-box;
      padding-inline-start: var(--gap-xxs);

      > span,
      .trakt-filter-title {
        flex-shrink: 0;
        white-space: nowrap;
      }
    }

    .trakt-filter-title {
      display: flex;
      align-items: center;
      gap: var(--gap-xxs);
    }

    .trakt-filter-control {
      display: flex;
      justify-content: flex-end;
      min-width: 0;
    }

    &[data-variant="compact"] {
      --select-chip-border: var(--color-filter-group-border);

      > span,
      .trakt-filter-title > span {
        @include visually-hidden;
      }

      &:has(> .trakt-filter-title) {
        flex-direction: row;
        align-items: stretch;
        gap: 0;

        border-radius: var(--border-radius-m);
        box-shadow: inset 0 0 0 var(--border-thickness-xxs)
          var(--color-filter-group-border);

        transition: var(--transition-increment) ease-in-out;
        transition-property: box-shadow, background-color;

        &:has(:global([data-has-value="true"])) {
          background-color: var(--color-filter-chip-background);
          box-shadow: inset 0 0 0 var(--border-thickness-xxs)
            var(--color-filter-chip-border);
        }

        .trakt-filter-title {
          padding-inline: var(--ni-4);
          border-inline-end: var(--border-thickness-xxs) solid
            var(--color-filter-group-border);
        }

        .trakt-filter-control {
          --select-chip-border: transparent;
          --color-filter-chip-border: transparent;
          --color-filter-chip-background: transparent;

          align-items: center;
        }
      }
    }
  }
</style>
