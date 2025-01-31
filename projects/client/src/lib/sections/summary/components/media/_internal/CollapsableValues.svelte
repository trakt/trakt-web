<script lang="ts" generics="T">
  import * as m from "$lib/features/i18n/messages.ts";

  import MoreButton from "$lib/components/buttons/more/MoreButton.svelte";
  import { MoreButtonIntlProvider } from "$lib/components/buttons/more/MoreButtonIntlProvider";
  import type { Snippet } from "svelte";
  import { writable } from "svelte/store";

  const MAX_ITEMS = 2;

  type CollapsableValuesProps<T> = {
    category: string;
    value: Snippet<[T]>;
    values: T[];
  } & ChildrenProps;

  const { category, values, value, children }: CollapsableValuesProps<T> =
    $props();

  const displayableValues = values.slice(0, MAX_ITEMS);
  const omittedValues = values.slice(MAX_ITEMS);

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

        {#if omittedValues.length > 0 && index === MAX_ITEMS - 1}
          <MoreButton
            i18n={MoreButtonIntlProvider}
            label="{m.expand_category({ category })}}"
            count={omittedValues.length}
            onExpand={() => expanded.set(true)}
            onCollapse={() => expanded.set(false)}
          />
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

<style>
  .trakt-collapsable-values,
  .trakt-collapsable-values-content {
    display: flex;
    flex-direction: column;

    gap: var(--gap-xxs);

    &.is-hidden {
      display: none;
    }
  }

  .trakt-displayable-value {
    display: grid;
    grid-template-columns: 1fr auto;

    gap: var(--gap-xxs);

    min-height: var(--ni-18);
  }
</style>
