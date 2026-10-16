<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SmartList } from "$lib/requests/queries/users/smartListQuery.ts";
  import FilterSection from "$lib/sections/navbar/components/filter/FilterSection.svelte";
  import { fade } from "svelte/transition";
  import type { SmartListRecipe } from "../models/SmartListRecipe.ts";
  import { toSmartListRecipe } from "../toSmartListRecipe.ts";
  import SmartListRecipeChip from "./SmartListRecipeChip.svelte";

  const { list, onClose }: {
    list: SmartList;
    onClose: () => void;
  } = $props();

  let isOpen = $state(false);

  const recipe = $derived(toSmartListRecipe(list));
  const hasFilters = $derived(
    recipe.includes.length > 0 ||
      recipe.limits.length > 0 ||
      recipe.hidden.length > 0,
  );
</script>

{#snippet chips(items: SmartListRecipe["limits"])}
  <ul class="recipe-chips">
    {#each items as item (item.key)}
      <SmartListRecipeChip label={item.label} />
    {/each}
  </ul>
{/snippet}

<Drawer
  {onClose}
  onOpened={() => (isOpen = true)}
  title={m.header_smart_list_recipe()}
  metaInfo={list.title}
>
  {#if isOpen}
    <div
      class="trakt-smart-list-recipe-drawer"
      transition:fade={{ duration: 150 }}
    >
      <FilterSection title={m.text_source()}>
        <div class="recipe-card recipe-source">
          <span class="bold">{recipe.source}</span>
          <span class="secondary small">{recipe.mediaType}</span>
        </div>
      </FilterSection>

      {#if recipe.includes.length > 0}
        <FilterSection title={m.header_smart_list_includes()}>
          <dl class="recipe-card recipe-rows">
            {#each recipe.includes as row (row.key)}
              <div class="recipe-row">
                <dt><span class="secondary small">{row.label}</span></dt>
                <dd>
                  <ul class="recipe-chips">
                    {#each row.values as value (value.key)}
                      <SmartListRecipeChip
                        label={value.label}
                        isExcluded={value.isExcluded}
                      />
                    {/each}
                  </ul>
                  {#if row.details.length > 0}
                    <span class="secondary small recipe-details">
                      {row.details.join(" · ")}
                    </span>
                  {/if}
                </dd>
              </div>
            {/each}
          </dl>
        </FilterSection>
      {/if}

      {#if recipe.limits.length > 0}
        <FilterSection title={m.header_smart_list_limits()}>
          <div class="recipe-card">
            {@render chips(recipe.limits)}
          </div>
        </FilterSection>
      {/if}

      {#if recipe.hidden.length > 0}
        <FilterSection title={m.header_smart_list_hide()}>
          <div class="recipe-card">
            {@render chips(recipe.hidden)}
          </div>
        </FilterSection>
      {/if}

      {#if !hasFilters}
        <p class="secondary">{m.text_smart_list_recipe_everything()}</p>
      {/if}
    </div>
  {/if}
</Drawer>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-smart-list-recipe-drawer {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);

    .recipe-card {
      padding: var(--ni-16);
      border-radius: var(--border-radius-m);
      background: color-mix(in srgb, var(--color-foreground) 4%, transparent);
    }

    .recipe-source {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: var(--gap-s);
    }

    .recipe-rows {
      margin: 0;
      padding-block: var(--ni-4);

      display: flex;
      flex-direction: column;
    }

    .recipe-row {
      display: grid;
      grid-template-columns: var(--ni-96) minmax(0, 1fr);
      align-items: baseline;
      gap: var(--gap-s);

      padding-block: var(--ni-12);

      & + .recipe-row {
        border-block-start: var(--ni-1) solid
          color-mix(in srgb, var(--color-foreground) 8%, transparent);
      }

      dt {
        overflow-wrap: anywhere;
      }

      dd {
        margin: 0;

        display: flex;
        flex-direction: column;
        gap: var(--gap-xs);
      }

      @include for-mobile {
        grid-template-columns: minmax(0, 1fr);
        gap: var(--gap-xs);
      }
    }

    .recipe-chips {
      margin: 0;
      padding: 0;
      list-style: none;

      display: flex;
      flex-wrap: wrap;
      gap: var(--gap-xxs);
    }
  }
</style>
