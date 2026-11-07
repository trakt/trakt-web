<script lang="ts">
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import { getLocale } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { isMaxDate } from "$lib/utils/date/isMaxDate.ts";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay.ts";

  const { releaseDate }: { releaseDate: Date } = $props();

  const releaseText = $derived(
    isMaxDate(releaseDate)
      ? m.tag_text_tba()
      : m.text_where_to_watch_release_date({
          date: toHumanDay({ date: releaseDate, locale: getLocale() }),
        }),
  );
</script>

<div class="trakt-where-to-watch-unreleased">
  <span class="unreleased-icon"><CalendarIcon /></span>
  <div class="unreleased-text">
    <p>{m.text_where_to_watch_not_streaming_yet()}</p>
    <p class="secondary">{releaseText}</p>
  </div>
</div>

<style>
  .trakt-where-to-watch-unreleased {
    box-sizing: border-box;
    box-shadow: var(--shadow-base);

    width: 100%;
    height: var(--height-where-to-watch-item);

    padding-inline: var(--ni-16);

    display: flex;
    align-items: center;
    gap: var(--gap-m);

    background-color: var(--color-card-background);
    border-radius: var(--border-radius-m);

  }

  .unreleased-icon {
    display: flex;
    flex-shrink: 0;
    color: var(--color-text-secondary);
  }

  .unreleased-text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 0;

    p {
      text-align: start;
    }
  }
</style>
