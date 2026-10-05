<script lang="ts">
  import UserRating from "$lib/sections/components/UserRating.svelte";
  import type { TodayActionRowProps } from "./TodayActionRowProps.ts";

  const { lead, title, action, time, rating, children }: TodayActionRowProps =
    $props();
</script>

<li class="trakt-today-action-row">
  <div class="row-lead">{@render lead()}</div>
  <div class="row-body">
    <div class="row-main">
      <div class="row-info">
        <p class="bold ellipsis">{title}</p>
        <p class="small ellipsis">{action}</p>
        <p class="small secondary ellipsis">{time}</p>
      </div>
      {#if rating != null}
        <UserRating {rating} size="small" />
      {/if}
    </div>
    {@render children?.()}
  </div>
</li>

<style>
  .trakt-today-action-row {
    position: relative;

    display: flex;
    gap: var(--gap-s);

    &:not(:last-child)::before {
      content: "";
      position: absolute;
      top: var(--ni-40);
      bottom: calc(-1 * var(--gap-m));
      inset-inline-start: calc(var(--ni-40) / 2);
      width: var(--border-thickness-xxs);

      background: linear-gradient(
        180deg,
        color-mix(in srgb, var(--purple-400) 55%, transparent),
        color-mix(in srgb, var(--purple-400) 10%, transparent)
      );
    }

    .row-lead {
      display: flex;
      justify-content: center;
      flex-shrink: 0;
      width: var(--ni-40);
    }

    .row-body {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xs);
      flex-grow: 1;
      min-width: 0;
    }

    .row-main {
      display: flex;
      align-items: flex-start;
      gap: var(--gap-s);
    }

    .row-info {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      min-width: 0;
    }
  }
</style>
