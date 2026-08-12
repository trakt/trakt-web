<script lang="ts" generics="T">
  import * as m from "$lib/features/i18n/messages.ts";

  import MoreButton from "$lib/components/buttons/more/MoreButton.svelte";
  import { MoreButtonIntlProvider } from "$lib/components/buttons/more/MoreButtonIntlProvider";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import type { Snippet } from "svelte";

  const maxItems = 2;

  type CollapsableValuesProps<T> = {
    category: string;
    value: Snippet<[T]>;
    values: T[];
  } & ChildrenProps;

  const { category, values, value, children }: CollapsableValuesProps<T> =
    $props();

  const displayableValues = $derived(values.slice(0, maxItems));
  const omittedValues = $derived(values.slice(maxItems));

  const expanded = writable(false);
</script>

<div class="trakt-collapsable-values">
  <div class="trakt-summary-details-grid-header">
    {@render children()}
  </div>
  <div class="trakt-collapsable-values-content">
    {#each displayableValues as v, index}
      <div class="trakt-displayable-value">
        {@render value(v)}

        {#if omittedValues.length > 0 && index === maxItems - 1}
          <RenderFor audience="all">
            <MoreButton
              i18n={MoreButtonIntlProvider}
              label="{m.button_label_expand_category({ category })}}"
              count={omittedValues.length}
              onExpand={() => expanded.set(true)}
              onCollapse={() => expanded.set(false)}
            />
          </RenderFor>
        {/if}
      </div>
    {/each}

    {#if omittedValues.length > 0}
      <div
        class="trakt-collapsable-values-content"
        class:is-hidden={!$expanded}
      >
        {#each omittedValues as v}
          <div class="trakt-displayable-value">
            {@render value(v)}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  /* Caps label over its values - one compact cell per fact. */
  .trakt-collapsable-values {
    display: flex;
    flex-direction: column;
    gap: var(--ni-4);

    min-width: 0;
  }

  .trakt-collapsable-values-content {
    display: flex;
    flex-direction: column;
    /*
      Stretch, never flex-start: a start-aligned column sizes each row to its
      CONTENT width, so a long value's box simply grew past the cell and over
      the neighbouring column - unconstrained boxes neither wrap nor
      ellipsize. Stretched, the row is the cell's width and the text handling
      inside can finally do its job.
    */
    align-items: stretch;
    text-align: start;
    min-width: 0;

    gap: var(--ni-2);

    &.is-hidden {
      display: none;
    }
  }

  .trakt-displayable-value {
    display: flex;
    align-items: baseline;

    gap: var(--gap-xs);

    min-height: var(--ni-18);
    min-width: 0;
    max-width: 100%;

    :global(.trakt-link) {
      min-width: 0;
    }
  }
</style>
