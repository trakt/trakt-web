<script lang="ts">
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import DateWithAnniversary from "$lib/sections/components/DateWithAnniversary.svelte";
  import { getYearsDifference } from "$lib/utils/date/getYearsDifference";
  import { isSameDayOfYear } from "$lib/utils/date/isSameDayOfYear";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay";
  import Celebration from "./Celebration.svelte";

  const {
    birthday,
    deathDate,
    variant = "default",
  }: {
    birthday: Date;
    deathDate: Date | Nil;
    variant?: "default" | "compact";
  } = $props();

  const today = new Date();

  const detailHeader = deathDate ? m.header_date_of_death() : m.header_age();
</script>

<div class="trakt-birthday-details" data-variant={variant}>
  <div class="trakt-birthday-detail">
    {#if isSameDayOfYear(birthday, today)}
      <Celebration />
    {/if}
    <span class="bold secondary">{m.header_birthday()}</span>
    <p>{toHumanDay(birthday, getLocale(), "short")}</p>
  </div>
  <div class="trakt-detail-separator"></div>
  <div class="trakt-birthday-detail">
    <span class="bold secondary">{detailHeader}</span>
    {#if deathDate}
      <DateWithAnniversary date={deathDate} referenceDate={birthday} />
    {/if}
    {#if !deathDate}
      <p>{getYearsDifference(birthday, today)}</p>
    {/if}
  </div>
</div>

<style>
  .trakt-birthday-details {
    --details-width: var(--ni-320);
    --details-gap: var(--gap-l);

    display: flex;
    gap: var(--details-gap);
    justify-content: center;

    width: var(--details-width);

    &[data-variant="compact"] {
      width: fit-content;

      .trakt-birthday-detail {
        width: fit-content;
        align-items: flex-end;
      }
    }
  }

  .trakt-detail-separator {
    width: var(--ni-1);
    background-color: var(--color-text-secondary);
    opacity: 0.25;
  }

  .trakt-birthday-detail {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-xxs);

    position: relative;
    width: calc(var(--details-width) / 2 - var(--details-gap) * 2);
  }
</style>
