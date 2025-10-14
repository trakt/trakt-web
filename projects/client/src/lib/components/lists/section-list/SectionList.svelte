<script lang="ts" generics="T extends { id: unknown }">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CaretLeftIcon from "$lib/components/icons/CaretLeftIcon.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { type Snippet } from "svelte";
  import { writable } from "svelte/store";
  import type { ListProps } from "../ListProps";
  import ShadowList from "./ShadowList.svelte";

  type SectionListProps<T> = ListProps<T> & {
    id: string;
    empty?: Snippet;
    metaInfo?: string;
  };

  const {
    id,
    items,
    title,
    item,
    ctaItem,
    empty,
    dynamicActions,
    metaInfo,
    actions: externalActions,
    badge,
    drilldownLink,
  }: SectionListProps<T> = $props();

  const scrollContainer = writable<HTMLDivElement>();
  const scrollX = writable({ left: 0, right: 0 });

  function scrollToLeft() {
    const left = Math.max(
      0,
      $scrollContainer.scrollLeft - window.innerWidth / 2,
    );

    $scrollContainer.scrollTo({
      left,
      behavior: "smooth",
    });
  }

  function scrollToRight() {
    const maxScrollLeft =
      $scrollContainer.scrollWidth - $scrollContainer.clientWidth;

    const left = Math.min(
      maxScrollLeft,
      $scrollContainer.scrollLeft + window.innerWidth / 2,
    );

    $scrollContainer.scrollTo({
      left,
      behavior: "smooth",
    });
  }

  const isLeftScrollDisabled = $derived($scrollX.left <= 0);
  const isRightScrollDisabled = $derived($scrollX.right <= 0);
</script>

<ShadowList
  {id}
  {title}
  {metaInfo}
  {items}
  {item}
  {ctaItem}
  {empty}
  {badge}
  {scrollX}
  {scrollContainer}
  {drilldownLink}
>
  {#snippet actions()}
    {#if dynamicActions != null}
      {@render dynamicActions()}
    {/if}

    <RenderFor audience="all" device={["tablet-sm", "tablet-lg", "desktop"]}>
      <ActionButton
        onclick={scrollToLeft}
        label={`Scroll ${title} to the left`}
        color="default"
        style="ghost"
        disabled={isLeftScrollDisabled}
      >
        <CaretLeftIcon />
      </ActionButton>
      <ActionButton
        onclick={scrollToRight}
        label={`Scroll ${title} to the right`}
        color="default"
        style="ghost"
        disabled={isRightScrollDisabled}
      >
        <CaretRightIcon />
      </ActionButton>
    </RenderFor>

    {#if externalActions != null}
      {@render externalActions()}
    {/if}
  {/snippet}
</ShadowList>
