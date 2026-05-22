<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ListProgress } from "../_internal/getListProgress.ts";

  const { progress }: { progress: ListProgress } = $props();

  type Status = "not-started" | "in-progress" | "completed";

  const status = $derived<Status>(
    progress.watched === 0
      ? "not-started"
      : progress.remaining === 0
      ? "completed"
      : "in-progress",
  );

  const statusLabel = $derived(
    status === "completed"
      ? m.tag_text_completed()
      : status === "in-progress"
      ? m.tag_text_in_progress()
      : m.tag_text_not_started(),
  );
</script>

<div
  class="trakt-list-progress-card-minimal"
  data-status={status}
  role="progressbar"
  aria-valuenow={progress.watched}
  aria-valuemin={0}
  aria-valuemax={progress.total}
  aria-label={m.list_title_progress()}
>
  <div class="trakt-list-progress-minimal-row">
    <span class="trakt-list-progress-minimal-status bold">
      {statusLabel}
    </span>
    <span class="trakt-list-progress-minimal-count secondary">
      {m.tag_text_number_of_items({ count: progress.total })}
    </span>
    <span class="trakt-list-progress-minimal-stats secondary">
      <span>{m.tag_text_items_watched({ count: progress.watched })}</span>
      <span class="trakt-list-progress-minimal-dot" aria-hidden="true">•</span>
      <span>{m.tag_text_count_left({ count: progress.remaining })}</span>
    </span>
  </div>

  <div class="trakt-list-progress-minimal-bar">
    <div
      class="trakt-list-progress-minimal-bar-fill"
      class:is-empty={progress.watched === 0}
      style:--progress-width={`${progress.percentage}%`}
    ></div>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-list-progress-card-minimal {
    grid-column: 1 / -1;

    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    height: var(--ni-40);
    box-sizing: border-box;
    width: 100%;

    border-radius: var(--ni-24);
    border: var(--border-thickness-xxs) solid var(--color-border);

    background-color: var(--color-background);
    color: var(--shade-10);
    overflow: hidden;

    @include for-mobile {
      grid-column: auto;
    }
  }

  .trakt-list-progress-minimal-row {
    flex: 1;
    display: flex;
    align-items: center;
    gap: var(--gap-s);

    padding: 0 var(--ni-16);
    min-width: 0;

    line-height: 1;
  }

  .trakt-list-progress-minimal-status {
    color: var(--green-600);
    flex-shrink: 0;

    .trakt-list-progress-card-minimal[data-status="completed"] & {
      color: var(--green-400);
    }

    .trakt-list-progress-card-minimal[data-status="not-started"] & {
      color: var(--shade-200);
    }
  }

  .trakt-list-progress-minimal-count {
    flex-shrink: 0;
  }

  .trakt-list-progress-minimal-stats {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: var(--gap-xxs);
    flex-shrink: 1;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @include for-mobile {
      font-size: var(--font-size-tag);
    }
  }

  .trakt-list-progress-minimal-dot {
    color: var(--shade-300);
  }

  .trakt-list-progress-minimal-bar {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: var(--ni-6);

    background-color: var(--shade-900);
  }

  .trakt-list-progress-minimal-bar-fill {
    width: var(--progress-width);
    min-width: var(--ni-32);
    height: 100%;

    background: linear-gradient(
      90deg,
      var(--green-700) 0%,
      var(--green-500) 55%,
      var(--green-400) 100%
    );

    transition: width var(--transition-increment) ease-in-out;

    &.is-empty {
      min-width: 0;
    }
  }
</style>
