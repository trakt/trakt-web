<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CaretLeftIcon from "$lib/components/icons/CaretLeftIcon.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import type { PaginatorIntl } from "./PaginatorIntl";

  type PaginatorProps = {
    i18n: PaginatorIntl;
    current: number;
    first: number;
    last: number;
    hrefFactory: (page: number) => string;
  };

  const { i18n, current, first, last, hrefFactory }: PaginatorProps = $props();

  const buttonProps = {
    noscroll: true,
    color: "purple",
    variant: "primary",
  } as const;

  const prev = $derived(Math.max(current - 1, first));
  const next = $derived(Math.min(current + 1, last));
  const isFirstPage = $derived(current === first);
  const isLastPage = $derived(current === last);
</script>

<div class="trakt-list-pagination">
  <ActionButton
    href={hrefFactory(prev)}
    label={i18n.goToPageLabel(prev)}
    disabled={isFirstPage}
    {...buttonProps}
  >
    <CaretLeftIcon />
  </ActionButton>
  <p>{current} / {last === Infinity ? "∞" : last}</p>
  <ActionButton
    href={hrefFactory(next)}
    label={i18n.goToPageLabel(next)}
    disabled={isLastPage}
    {...buttonProps}
  >
    <CaretRightIcon />
  </ActionButton>
</div>

<style>
  .trakt-list-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--ni-8);
  }
</style>
