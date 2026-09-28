<script lang="ts">
  import UserRating from "$lib/sections/components/UserRating.svelte";
  import type { TodayActionRowProps } from "./TodayActionRowProps.ts";

  const { lead, title, detail, rating }: TodayActionRowProps = $props();
</script>

<div class="trakt-today-action-row">
  {@render lead()}
  <div class="row-info">
    <p class="bold ellipsis">{title}</p>
    <p class="small secondary ellipsis">{detail}</p>
  </div>
  {#if rating != null}
    <UserRating {rating} size="small" />
  {/if}
</div>

<style>
  .trakt-today-action-row {
    display: flex;
    align-items: center;
    gap: var(--gap-s);

    .row-info {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      min-width: 0;
    }
  }
</style>
