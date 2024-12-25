<script lang="ts" generics="T extends { id: unknown }">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { type Snippet } from "svelte";
  import { writable } from "svelte/store";
  import ActionButton from "../buttons/ActionButton.svelte";
  import CaretLeftIcon from "../icons/CaretLeftIcon.svelte";
  import CaretRightIcon from "../icons/CaretRightIcon.svelte";
  import ShadowList from "./ShadowList.svelte";

  type SectionListProps<T> = {
    id: string;
    title: string;
    items: T[];
    item: Snippet<[T]>;
    empty?: Snippet;
  };

  const { id, items, title, item, empty }: SectionListProps<T> = $props();

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

<ShadowList {id} {title} {items} {item} {empty} {scrollX} {scrollContainer}>
  {#snippet actions()}
    <RenderFor audience="all" device={["tablet-sm", "tablet-lg", "desktop"]}>
      <ActionButton
        onclick={scrollToLeft}
        label={`Scroll ${title} to the left`}
        color="purple"
        disabled={isLeftScrollDisabled}
      >
        <CaretLeftIcon />
      </ActionButton>
      <ActionButton
        onclick={scrollToRight}
        label={`Scroll ${title} to the right`}
        color="purple"
        disabled={isRightScrollDisabled}
      >
        <CaretRightIcon />
      </ActionButton>
    </RenderFor>
  {/snippet}
</ShadowList>
