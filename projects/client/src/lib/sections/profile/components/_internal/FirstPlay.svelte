<script lang="ts">
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  const { title }: { title: string } = $props();
</script>

<div class="trakt-month-in-review-stat">
  <PlayIcon />
  <div class="trakt-month-in-review-stat-value">
    <span class="meta-info">{m.text_first_play_this_month()}</span>
    <h6>{title}</h6>
  </div>
</div>

<style>
  .trakt-month-in-review-stat {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    :global(svg) {
      width: var(--ni-32);
      height: var(--ni-32);
    }
  }

  .trakt-month-in-review-stat-value {
    display: flex;
    flex-direction: column;

    span {
      color: var(--shade-300);
    }
  }
</style>
