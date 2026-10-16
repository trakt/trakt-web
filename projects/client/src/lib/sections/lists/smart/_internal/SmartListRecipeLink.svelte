<script lang="ts">
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SmartList } from "$lib/requests/queries/users/smartListQuery.ts";
  import { toSmartListRecipePreview } from "../toSmartListRecipePreview.ts";
  import {
    SmartListDrawers,
    smartListDrawerNavigation,
  } from "./smartListDrawerNavigation.ts";

  const { list }: { list: SmartList } = $props();

  const { buildDrawerLink } = smartListDrawerNavigation();
  const preview = $derived(toSmartListRecipePreview(list));
</script>

<div class="trakt-smart-list-recipe-link">
  <Link
    {...buildDrawerLink(SmartListDrawers.Recipe)}
    label={m.button_label_view_smart_list_recipe({ title: list.title })}
    color="inherit"
  >
    <span class="ellipsis bold">{preview.summary}</span>
    {#if preview.remaining > 0}
      <span class="recipe-more bold">
        {m.text_smart_list_recipe_more({ count: preview.remaining })}
      </span>
    {/if}
    <CaretRightIcon />
  </Link>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-smart-list-recipe-link {
    display: flex;
    min-width: 0;
    max-width: 100%;

    :global(.trakt-link) {
      min-width: 0;

      display: flex;
      align-items: center;
      gap: var(--gap-xxs);

      color: var(--list-meta-info-color);
      text-decoration: none;

      transition: opacity var(--transition-increment) ease-in-out;

      &:active {
        opacity: 0.7;
      }

      &:focus-visible {
        outline: var(--border-thickness-xs) solid currentColor;
        outline-offset: var(--ni-2);
        border-radius: var(--border-radius-xs);
      }

      @include for-mouse {
        &:hover {
          opacity: 0.8;
        }
      }
    }

    .recipe-more {
      flex-shrink: 0;
      white-space: nowrap;
    }

    :global(svg) {
      flex-shrink: 0;

      width: var(--ni-12);
      height: var(--ni-12);
    }
  }
</style>
