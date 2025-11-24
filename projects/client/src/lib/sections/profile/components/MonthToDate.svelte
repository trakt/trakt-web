<script lang="ts">
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import YearToDateArrow from "$lib/components/icons/YearToDateArrow.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { getPreviousMonth } from "$lib/utils/date/getPreviousMonth";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { useMonthToDate } from "../stores/useMonthToDate";
  import WatchStats from "./_internal/WatchStats.svelte";
  import YearToDateLink from "./YearToDateLink.svelte";

  const { slug }: { slug: string } = $props();

  const mirDate = getPreviousMonth(new Date());
  const mirHref = $derived(
    UrlBuilder.users(slug).monthInReview(
      mirDate.getFullYear(),
      mirDate.getMonth() + 1,
    ),
  );

  const { monthToDate, isLoading } = $derived(useMonthToDate({ slug }));
</script>

<div class="trakt-month-to-date">
  {#if !$isLoading && $monthToDate}
    <div class="trakt-month-to-date-cover-image">
      <CrossOriginImage
        loading="eager"
        src={$monthToDate.coverUrl}
        alt={`Background for ${$monthToDate.firstWatchedTitle}`}
        animate={false}
      />
    </div>

    <div class="trakt-month-to-date-header">
      <div class="trakt-month-to-date-header-this-month">
        <CalendarIcon />
        <span class="bold uppercase">{m.text_this_month()}</span>
      </div>
      <YearToDateLink {slug} />
    </div>

    <WatchStats monthToDate={$monthToDate} />

    <div class="trakt-month-in-review-link">
      <Link href={mirHref} color="inherit">
        <YearToDateArrow />
        <div class="trakt-month-in-review-label">
          <span class="bold uppercase">
            {toHumanMonth(mirDate, languageTag())}
          </span>
        </div>
      </Link>
    </div>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-month-to-date {
    --month-to-date-icon-size: var(--ni-18);

    position: relative;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--gap-m);

    height: var(--ni-148);

    padding: var(--ni-14);
    box-sizing: border-box;

    border-radius: var(--border-radius-l);

    color: var(--shade-10);
    background: var(--shade-900);

    filter: drop-shadow(
        var(--ni-0) var(--ni-88) var(--ni-36)
          color-mix(in srgb, var(--color-shadow) 2%, transparent)
      )
      drop-shadow(
        var(--ni-0) var(--ni-52) var(--ni-32)
          color-mix(in srgb, var(--color-shadow) 6%, transparent)
      )
      drop-shadow(
        var(--ni-0) var(--ni-24) var(--ni-24)
          color-mix(in srgb, var(--color-shadow) 10%, transparent)
      )
      drop-shadow(
        var(--ni-0) var(--ni-8) var(--ni-12)
          color-mix(in srgb, var(--color-shadow) 12%, transparent)
      );
  }

  .trakt-month-to-date-cover-image {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    overflow: hidden;
    border-radius: var(--border-radius-l);
    z-index: var(--layer-background);

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      opacity: 0.2;
    }
  }

  .trakt-month-to-date-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-m);

    :global(svg) {
      width: var(--month-to-date-icon-size);
      height: var(--month-to-date-icon-size);
    }
  }

  .trakt-month-to-date-header-this-month {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }

  .trakt-month-in-review-link {
    :global(.trakt-link) {
      text-decoration: none;

      display: flex;
      align-items: center;
      gap: var(--gap-xs);
    }

    @include for-mouse {
      &:hover,
      &:focus-visible {
        color: var(--purple-300);
      }
    }

    :global(svg) {
      width: var(--month-to-date-icon-size);
      height: var(--month-to-date-icon-size);
    }
  }
</style>
