<script lang="ts">
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { useEditMode } from "$lib/features/edit-mode/useEditMode";
  import type { Snippet } from "svelte";
  import type { ListDrilldownLinkProps } from "../section-list/models/ListDrilldownLinkProps";

  type ListTitleProps = {
    title: string;
    metaInfo?: Snippet;
    drilldown?: ListDrilldownLinkProps;
    subtitle?: string;
    disabled?: boolean;
  } & HTMLElementProps;

  const {
    title,
    metaInfo,
    subtitle,
    drilldown,
    disabled,
    ...props
  }: ListTitleProps = $props();

  const { isEditMode } = useEditMode();
  const { track } = useTrack(AnalyticsEvent.Drilldown);
</script>

{#snippet content()}
  <div class="trakt-list-title-wrapper">
    <span
      class="title shadow-list-title ellipsis"
      data-style={subtitle ? "secondary" : "primary"}
    >
      {title}
    </span>
    {#if subtitle}
      <span class="title shadow-list-title ellipsis" data-style="primary">
        {`/ ${subtitle}`}
      </span>
    {/if}
  </div>
{/snippet}

<div
  class="trakt-list-title"
  data-drilldown={drilldown && !$isEditMode ? "" : undefined}
  {...props}
>
  {#if drilldown && !$isEditMode}
    <Link
      href={drilldown.href}
      label={drilldown.label}
      noscroll={drilldown.noscroll}
      replacestate={drilldown.replacestate}
      disabled={disabled || drilldown.mode === "disabled"}
      color="inherit"
      onclick={() =>
        track({ source: drilldown.source.id, type: drilldown.source.type })}
    >
      {@render content()}
      <CaretRightIcon />
    </Link>
  {:else}
    {@render content()}
  {/if}

  {#if metaInfo}
    {@render metaInfo()}
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-list-title {
    display: flex;
    flex-direction: column;
    min-width: 0;

    .trakt-list-title-wrapper,
    :global(.trakt-link) {
      display: flex;
      align-items: center;
      gap: var(--gap-xxs);
      min-width: 0;
    }

    :global(.trakt-link) {
      text-decoration: none;
    }

    &[data-drilldown] {
      :global(.trakt-link) {
        :global(svg) {
          flex-shrink: 0;
          width: calc(var(--font-size-title) * 0.9);
          height: calc(var(--font-size-title) * 0.9);

          color: var(--color-text-primary);

          transition: color var(--transition-increment) ease-in-out;
        }

        @include for-mouse {
          &:hover {
            color: var(--color-link-active);

            :global(.shadow-list-title),
            :global(svg) {
              color: var(--color-link-active);
            }
          }
        }
      }

      :global(.trakt-no-link) {
        :global(svg) {
          color: var(--color-foreground-button-disabled);
        }
      }

      .shadow-list-title {
        width: auto;
        max-width: none;

        transition: color var(--transition-increment) ease-in-out;
      }
    }
  }

  .shadow-list-title {
    &[data-style="primary"] {
      color: var(--color-text-primary);
    }

    &[data-style="secondary"] {
      color: var(--color-text-secondary);
    }

    /** FIXME: remove when we have adaptive typography and updated sizes */
    font-size: var(--font-size-title);
    line-height: var(--ni-22);
    &.ellipsis {
      max-width: 100%;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: block;
    }
  }
</style>
