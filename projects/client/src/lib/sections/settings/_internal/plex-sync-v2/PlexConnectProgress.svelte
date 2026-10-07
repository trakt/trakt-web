<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  const {
    current,
    total,
    title,
  }: {
    current: number;
    total: number;
    title: string;
  } = $props();
</script>

<div class="trakt-plex-connect-progress">
  <p class="small">
    <span class="secondary">
      {m.text_media_sync_step({ current, total })}
    </span>
    <span class="bold">{title}</span>
  </p>
  <div
    class="segments"
    role="progressbar"
    aria-valuemin={1}
    aria-valuemax={total}
    aria-valuenow={current}
    aria-label={m.text_media_sync_step({ current, total })}
  >
    {#each { length: total }, index (index)}
      <span class="segment" class:is-done={index < current}></span>
    {/each}
  </div>
</div>

<style lang="scss">
  .trakt-plex-connect-progress {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    p {
      display: flex;
      gap: var(--gap-xs);
      margin: 0;
    }
  }

  .segments {
    display: flex;
    gap: var(--gap-xxs);
  }

  .segment {
    flex: 1;
    height: var(--ni-4);
    border-radius: var(--border-radius-xl);

    background: color-mix(in srgb, var(--purple-500) 20%, transparent);
    transition: background-color var(--transition-increment) ease-in-out;

    &.is-done {
      background: var(--purple-500);
    }
  }
</style>
