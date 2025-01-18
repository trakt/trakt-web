<script lang="ts" generics="T extends { id: unknown }">
  import { GlobalEventBus } from "$lib/utils/events/GlobalEventBus";
  import { debounce } from "$lib/utils/timing/debounce";
  import { time } from "$lib/utils/timing/time";
  import "../_internal/list.css";
  import ListHeader from "../_internal/ListHeader.svelte";
  import type { ListProps } from "../ListProps";

  type PageListProps<T> = ListProps<T>;

  const { items, title, item, actions }: PageListProps<T> = $props();

  function snapshotHeight(node: HTMLElement) {
    const snapshot = debounce<UIEvent>(() => {
      node.style.height = "";
      const { height } = node.getBoundingClientRect();
      node.style.height = `${height}px`;
    }, time.fps(60));

    snapshot();

    const destroy = GlobalEventBus.getInstance().register("resize", snapshot);
    const observer = new MutationObserver(() => {
      snapshot();
      observer.disconnect();
    });
    observer.observe(node, { childList: true, subtree: true });

    return {
      destroy: () => {
        destroy();
        observer.disconnect();
      },
    };
  }
</script>

<section class="trakt-page-list-container" use:snapshotHeight>
  <ListHeader {title} {actions} inset="all" />

  <div class="trakt-list-item-container trakt-page-list-items">
    {#each items as i (i.id)}
      {@render item(i)}
    {/each}
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-page-list-container {
    display: flex;
    flex-direction: column;
    gap: var(--ni-32);
  }

  .trakt-page-list-items {
    display: grid;
    grid-template-columns: repeat(auto-fill, var(--width-item));
    /* TODO: investigate how we can better distribute empty spaces (@anodpixels) */
    justify-content: center;
    grid-column-gap: var(--ni-8);
    grid-row-gap: var(--ni-16);

    @include for-mobile {
      grid-template-columns: 1fr;
    }
  }
</style>
