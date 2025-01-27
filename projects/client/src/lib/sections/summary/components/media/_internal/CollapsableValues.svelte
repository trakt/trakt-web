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
  };

  const { category, values, value }: CollapsableValuesProps<T> = $props();

  const displayableValues = values.slice(0, MAX_ITEMS);
  const omittedValues = values.slice(MAX_ITEMS);

  const expanded = writable(false);
</script>

<div class="trakt-collapsable-values">
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
    <div hidden={!$expanded}>
      <div class="trakt-omitted-values">
        {#each omittedValues as v}
          <div class="trakt-displayable-value">
            {@render value(v)}
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .trakt-collapsable-values,
  .trakt-omitted-values {
    display: flex;
    flex-direction: column;

    gap: var(--gap-xxs);
  }

  .trakt-displayable-value {
    display: grid;
    grid-template-columns: 1fr auto;

    gap: var(--gap-xxs);
  }
</style>
