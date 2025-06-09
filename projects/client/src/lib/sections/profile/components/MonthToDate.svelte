<script lang="ts">
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import YearToDateArrow from "$lib/components/icons/YearToDateArrow.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { languageTag } from "$lib/features/i18n";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { getPreviousMonth } from "$lib/utils/date/getPreviousMonth";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { useMonthToDate } from "../stores/useMonthToDate";
  import FirstPlay from "./_internal/FirstPlay.svelte";
  import WatchStats from "./_internal/WatchStats.svelte";

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
      <CalendarIcon />
      <div>
        <h6 class="uppercase">So far,</h6>
        <h6 class="uppercase">This month</h6>
      </div>
    </div>

    <WatchStats monthToDate={$monthToDate} />

    <div class="trakt-month-in-review-link">
      <Link href={mirHref} color="inherit">
        <YearToDateArrow />
        <div class="trakt-month-in-review-label">
          <h6 class="uppercase">{toHumanMonth(mirDate, languageTag())}</h6>
          <h6 class="uppercase">in review</h6>
        </div>
      </Link>
    </div>

    {#if $monthToDate.firstWatchedTitle}
      <FirstPlay title={$monthToDate.firstWatchedTitle} />
    {/if}
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  @mixin single-column-layout {
    height: var(--ni-320);
    grid-template-columns: 1fr;

    .trakt-month-in-review-link {
      order: 3;
    }

    :global(.trakt-first-play) {
      order: 4;
    }

    :global(.trakt-watch-stat) {
      width: 100%;
      box-sizing: border-box;
    }
  }

  .trakt-month-to-date {
    position: relative;
    display: grid;
    grid-template-columns: auto auto;
    gap: var(--gap-m);

    align-content: space-between;
    align-items: start;
    height: var(--ni-232);

    padding: var(--ni-24);
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

    @include for-mobile {
      @include single-column-layout;
    }

    @include for-tablet-lg {
      @include single-column-layout;
    }
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
    gap: var(--gap-m);

    h6 {
      line-height: var(--ni-14);
    }
  }

  .trakt-month-in-review-link {
    h6 {
      line-height: var(--ni-14);
    }

    :global(.trakt-link) {
      text-decoration: none;

      display: flex;
      align-items: center;
      gap: var(--gap-m);
    }

    @include for-mouse {
      &:hover,
      &:focus-visible {
        color: var(--purple-300);
      }
    }

    :global(svg) {
      width: var(--ni-24);
      height: var(--ni-24);
    }
  }
</style>
