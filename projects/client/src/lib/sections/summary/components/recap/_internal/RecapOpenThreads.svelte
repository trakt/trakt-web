<script lang="ts">
  import QuestionIcon from "$lib/components/icons/QuestionIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { RecapLine } from "$lib/requests/models/RecapLine.ts";
  import InfoCard from "../../_internal/InfoCard.svelte";

  const { lines }: { lines: ReadonlyArray<RecapLine> } = $props();
</script>

<div class="trakt-recap-open-threads">
  <InfoCard variant="dashed" size="compact">
    <ul class="thread-list">
      {#each lines as line (line.key)}
        <li class="thread-row">
          <span class="thread-icon" aria-hidden="true"><QuestionIcon /></span>
          <span class="thread-copy">
            <span class="small bold thread-label">
              {m.header_recap_open_thread()}
            </span>
            <span class="small secondary thread-text">{line.text}</span>
          </span>
        </li>
      {/each}
    </ul>
  </InfoCard>
</div>

<style lang="scss">
  .trakt-recap-open-threads {
    grid-column: 1 / -1;

    .thread-list {
      display: flex;
      flex-direction: column;

      margin: 0;
      padding: 0;
      list-style: none;
    }

    .thread-row {
      display: flex;
      align-items: flex-start;
      gap: var(--gap-s);

      padding-block: var(--gap-s);

      &:first-child {
        padding-top: 0;
      }

      &:last-child {
        padding-bottom: 0;
      }

      &:not(:first-child) {
        border-top: var(--border-thickness-xxs) solid
          color-mix(in srgb, var(--color-text-primary) 8%, transparent);
      }
    }

    .thread-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      width: var(--ni-32);
      height: var(--ni-32);

      border-radius: 50%;
      background-color: color-mix(in srgb, var(--purple-500) 24%, transparent);
      color: var(--color-text-emphasis);

      :global(svg) {
        width: var(--ni-16);
        height: var(--ni-16);
      }
    }

    .thread-copy {
      display: flex;
      flex-direction: column;
      gap: var(--ni-2);
      min-width: 0;
    }

    .thread-label {
      color: var(--color-text-emphasis);
    }

    .thread-text {
      line-height: var(--ni-18);
    }
  }
</style>
