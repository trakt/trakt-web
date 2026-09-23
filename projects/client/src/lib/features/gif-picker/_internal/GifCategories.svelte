<script lang="ts">
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { gifCategoriesQuery } from "$lib/requests/queries/gifs/gifCategoriesQuery.ts";
  import { map } from "rxjs";
  import { untrack } from "svelte";

  type GifCategoriesProps = {
    customerId: string;
    onSelect: (query: string) => void;
  };

  const { customerId, onSelect }: GifCategoriesProps = $props();

  const categories = useQuery(
    untrack(() => gifCategoriesQuery({ customerId })),
  ).pipe(map((state) => state.data ?? []));
</script>

{#if $categories.length > 0}
  <div class="trakt-gif-categories">
    {#each $categories as category (category.query)}
      <button
        type="button"
        class="gif-category"
        onclick={() => onSelect(category.query)}
        style:--gif-tile-image="url({category.previewUrl})"
      >
        <span class="tag bold capitalize">{category.title}</span>
      </button>
    {/each}
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-gif-categories {
    display: flex;
    flex-shrink: 0;
    gap: var(--gap-xs);

    overflow-x: auto;
    scrollbar-width: none;

    padding: var(--border-thickness-xs);
    margin: calc(-1 * var(--border-thickness-xs));

    .gif-category {
      @include gif-tile-surface;

      flex: 0 0 auto;
      display: flex;
      align-items: flex-end;

      width: var(--ni-96);
      height: var(--ni-56);
      box-sizing: border-box;
      padding: var(--ni-4) var(--ni-8);

      span {
        // Always sits on a gif, never on the page, so it is light in both themes.
        color: var(--shade-50);
        text-shadow: 0 var(--ni-1) var(--ni-4) var(--shade-900);
      }
    }
  }
</style>
