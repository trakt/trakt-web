<script lang="ts">
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { m } from "$lib/paraglide/messages";
  import type { YirWatchedItem } from "$lib/requests/models/YirDetail";
  import { PLACEHOLDERS } from "$lib/utils/assets";
  import { toHumanClockTime } from "$lib/utils/formatting/date/toHumanClockTime";
  import { toHumanLongDate } from "$lib/utils/formatting/date/toHumanLongDate";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import YirSectionHeader from "./YirSectionHeader.svelte";

  const {
    how,
    item,
    year,
  }: {
    how: "first" | "last";
    item: YirWatchedItem;
    year: number;
  } = $props();

  const formattedDate = $derived(
    toHumanLongDate(item.watchedAt, languageTag()),
  );
  const formattedTime = $derived(
    toHumanClockTime(item.watchedAt, languageTag()),
  );

  const itemUrl = $derived(UrlBuilder.media(item.entry.type, item.entry.slug));

  const headerText = $derived(
    how === "first"
      ? m.yir_calendar_first_play({ year })
      : m.yir_calendar_last_play({ year }),
  );
</script>

<section class="yir-calendar-section" id="section-{how}-play">
  <div
    class="yir-calendar-bg"
    style:background-image="url({item.entry.cover.url.medium})"
  ></div>
  <div class="yir-calendar-shade"></div>

  <div class="yir-calendar-inner">
    <YirSectionHeader>
      {headerText}
    </YirSectionHeader>

    <a href={itemUrl} class="yir-calendar-media">
      {#if !PLACEHOLDERS.includes(item.entry.logo.url.medium)}
        <div class="yir-logo-wrapper">
          <img
            class="yir-calendar-logo"
            src={item.entry.logo.url.medium}
            alt={item.entry.title}
          />
        </div>
      {:else}
        <h3 class="yir-calendar-title">{item.entry.title}</h3>
      {/if}

      {#if item.type === "episode"}
        <h4 class="yir-calendar-episode">{item.episode.title}</h4>
      {/if}
    </a>

    <div class="yir-calendar-date">
      <span class="yir-calendar-icon"><CalendarIcon /></span>
      <span class="yir-calendar-month">{formattedDate}</span>
      <span class="yir-calendar-time">{formattedTime}</span>
    </div>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .yir-calendar-section {
    position: relative;
    text-align: center;
    background-color: var(--shade-950);
  }

  .yir-calendar-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    opacity: 1;
    transition: opacity 1s;
  }

  .yir-calendar-shade {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      color-mix(in srgb, var(--shade-1000) 80%, transparent),
      transparent
    );
  }

  .yir-calendar-inner {
    position: relative;
    z-index: 1;
    padding: var(--ni-20) 0 var(--ni-88) 0;
  }

  .yir-calendar-media {
    display: block;
    text-decoration: none;
    color: var(--shade-10);
  }

  .yir-logo-wrapper {
    .yir-calendar-logo {
      max-width: 70%;
      width: var(--ni-300);
    }
  }

  .yir-calendar-title {
    font-size: var(--ni-40);
    text-shadow: var(--ni-1) var(--ni-1) var(--ni-2)
      color-mix(in srgb, var(--shade-1000) 80%, transparent);
    margin: 0;

    @include for-mobile {
      font-size: var(--ni-32);
      padding: 0 var(--ni-16);
    }
  }

  .yir-calendar-episode {
    text-shadow: var(--ni-1) var(--ni-1) var(--ni-2)
      color-mix(in srgb, var(--shade-1000) 80%, transparent);
    margin: var(--ni-10) 0 0 0;
    font-size: var(--ni-22);

    @include for-mobile {
      font-size: var(--ni-16);
      padding: 0 var(--ni-16);
    }
  }

  .yir-calendar-date {
    display: inline-grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
    align-items: center;
    gap: 0 var(--gap-xs);
    margin-top: var(--ni-60);
    line-height: 1.2;
  }

  .yir-calendar-icon {
    grid-row: 1 / 3;
    display: flex;
    align-items: center;
    color: var(--shade-10);
    opacity: 0.7;

    :global(svg) {
      width: var(--ni-36);
      height: var(--ni-36);
    }
  }

  .yir-calendar-month {
    text-transform: uppercase;
    font-size: var(--ni-18);
    font-weight: bold;
    text-align: left;
  }

  .yir-calendar-time {
    font-size: var(--ni-18);
    text-align: left;
    padding-top: 2px;
  }
</style>
