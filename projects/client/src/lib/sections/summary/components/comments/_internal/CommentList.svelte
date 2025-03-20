<script lang="ts" generics="T extends { id: unknown }">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CaretLeftIcon from "$lib/components/icons/CaretLeftIcon.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import type { ListProps } from "$lib/components/lists/ListProps";
  import ShadowList from "$lib/components/lists/section-list/ShadowList.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { useVarToPixels } from "$lib/stores/css/useVarToPixels";
  import { writable } from "svelte/store";

  type CommentListProps<T> = Omit<
    ListProps<T>,
    "actions" | "dynamicActions" | "badge"
  >;

  const { id, items, title, item }: CommentListProps<T> = $props();

  const scrollContainer = writable<HTMLDivElement>();
  const scrollX = writable({ left: 0, right: 0 });

  const itemWidth = useVarToPixels("var(--width-comment-thread-card)", false);

  function scrollToLeft() {
    const left = Math.max(0, $scrollContainer.scrollLeft - $itemWidth);

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
      $scrollContainer.scrollLeft + $itemWidth,
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
  {items}
  {item}
  {scrollX}
  {scrollContainer}
  variant="centered"
  --item-width="var(--width-comment-thread-card)"
>
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
