<script lang="ts">
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import DateWithAnniversary from "$lib/sections/components/DateWithAnniversary.svelte";
  import { getYearsDifference } from "$lib/utils/date/getYearsDifference";
  import { isSameDayOfYear } from "$lib/utils/date/isSameDayOfYear";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay";
  import { toMeasurement } from "$lib/utils/formatting/number/toMeasurement";
  import Celebration from "./Celebration.svelte";

  const {
    birthday,
    deathDate,
    height,
    variant = "default",
  }: {
    birthday: Date | Nil;
    deathDate: Date | Nil;
    height: number | Nil;
    variant?: "default" | "compact";
  } = $props();

  const today = new Date();

  const detailHeader = $derived(
    deathDate ? m.header_date_of_death() : m.header_age(),
  );
</script>

<!-- TODO: @seferturan let's discuss how to refactor this -->
<div class="trakt-person-details" data-variant={variant}>
  {#if height}
    <div class="trakt-person-detail">
      <span class="bold secondary">{m.header_height()}</span>
      <p>{toMeasurement(height / 100, getLocale())}</p>
    </div>
    {#if birthday}
      <div class="trakt-detail-separator"></div>
    {/if}
  {/if}
  {#if birthday}
    <div class="trakt-person-detail">
      {#if isSameDayOfYear(birthday, today)}
        <Celebration />
      {/if}
      <span class="bold secondary">{m.header_birthday()}</span>
      <p>{toHumanDay(birthday, getLocale(), "short")}</p>
    </div>
    <div class="trakt-detail-separator"></div>
    <div class="trakt-person-detail">
      <span class="bold secondary">{detailHeader}</span>
      {#if deathDate}
        <DateWithAnniversary date={deathDate} referenceDate={birthday} />
      {/if}
      {#if !deathDate}
        <p>{getYearsDifference(birthday, today)}</p>
      {/if}
    </div>
  {/if}
</div>

<style>
  .trakt-person-details {
    --details-width: var(--ni-320);
    --details-gap: var(--gap-m);

    display: flex;
    gap: var(--details-gap);
    justify-content: center;

    width: var(--details-width);

    &[data-variant="compact"] {
      width: fit-content;

      .trakt-person-detail {
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

  .trakt-person-detail {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-xxs);

    position: relative;
    width: calc(var(--details-width) / 2 - var(--details-gap) * 2);
  }
</style>
