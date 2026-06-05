<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import type { ProgressEntry } from "$lib/requests/models/ProgressEntry.ts";
  import { getLocale, languageTag } from "$lib/features/i18n";
  import { isMaxDate } from "$lib/utils/date/isMaxDate.ts";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay.ts";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration.ts";
  import { toTraktRating } from "$lib/utils/formatting/number/toTraktRating.ts";
  import { toUserRating } from "$lib/utils/formatting/number/toUserRating.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SortBy } from "$lib/sections/lists/user/models/SortBy.ts";
  import SortIcon from "$lib/sections/lists/user/SortIcon.svelte";

  const { entry, sortBy }: { entry: ProgressEntry; sortBy?: SortBy } =
    $props();

  const { ratings } = useUser();

  const userRating = $derived(
    sortBy === "my_rating" ? $ratings?.shows.get(entry.show.id)?.rating : undefined,
  );

  const valueText = $derived.by(() => {
    if (!sortBy) return undefined;

    switch (sortBy) {
      case "runtime":
        return toHumanDuration(
          { minutes: entry.show.totalRuntime },
          languageTag(),
        );
      case "released": {
        const releaseDate = entry.show.effectiveReleaseDate;
        return isMaxDate(releaseDate)
          ? m.tag_text_tba()
          : toHumanDay({ date: releaseDate, locale: getLocale(), format: "short" });
      }
      case "percentage": {
        const rating = entry.show.rating;
        return rating ? toTraktRating(rating, getLocale()) : undefined;
      }
      case "my_rating":
        return userRating != null
          ? toUserRating(userRating, getLocale())
          : undefined;
      case "title":
        return entry.show.title[0]?.toUpperCase();
    }
  });
</script>

<div class="trakt-sort-value">
  {#if valueText && sortBy}
    <div class="trakt-sort-value">
      <SortIcon {sortBy} variant="value" />
      <p class="bold ellipsis">
        {valueText}
      </p>
    </div>
  {/if}
</div>

<style>
  .trakt-sort-value {
    display: flex;
    align-items: center;
    gap: var(--gap-micro);

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }
</style>
