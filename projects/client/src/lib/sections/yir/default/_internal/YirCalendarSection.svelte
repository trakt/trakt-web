<script lang="ts">
  import type { YirWatchedItem } from "$lib/requests/models/YirDetail";
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { m } from "$lib/paraglide/messages";

  const {
    how,
    item,
    year,
  }: {
    how: "first" | "last";
    item: YirWatchedItem;
    year: number;
  } = $props();

  const watchedDate = $derived(new Date(item.watchedAt));

  const formattedDate = $derived(
    watchedDate.toLocaleDateString(languageTag(), {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  );

  const formattedTime = $derived(
    watchedDate.toLocaleTimeString(languageTag(), {
      hour: "numeric",
      minute: "2-digit",
    }),
  );

  const slug = $derived(item.entry.slug);
  const mediaType = $derived(item.entry.type === "show" ? "shows" : "movies");
  const itemUrl = $derived(`/${mediaType}/${slug}`);

  const headerText = $derived(
    how === "first"
      ? m.yir_calendar_first_play({ year })
      : m.yir_calendar_last_play({ year })
  );
</script>

<section
  class="yir-calendar-section"
  id="section-{how}-play"
>
  <div
    class="yir-calendar-bg"
    style:background-image="url({item.entry.cover.url.medium})"
  ></div>
  <div class="yir-calendar-shade"></div>

  <div class="yir-calendar-inner">
    <div class="yir-section-header">
      <h2>
        <span class="yir-header-text">{headerText}</span>
      </h2>
    </div>

    <a href={itemUrl} class="yir-calendar-media">
      {#if item.entry.logo.url.medium}
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

      {#if item.episodeTitle}
        <h4 class="yir-calendar-episode">{item.episodeTitle}</h4>
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
    background: radial-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0));
  }

  .yir-calendar-inner {
    position: relative;
    z-index: 1;
    padding: 20px 0 90px 0;
  }

  .yir-section-header {
    text-align: center;
    padding: 70px 0;

    h2 {
      text-transform: uppercase;
      display: inline-block;
      letter-spacing: 1px;
      border: solid 1px #fff;
      background-color: rgba(0, 0, 0, 0.5);
      font-size: 16px;
      line-height: 1;
      text-align: center;
      margin: 0;
    }

    @include for-mobile {
      padding: 40px 0;
    }
  }

  .yir-header-text {
    display: inline-block;
    padding: 6px 8px;
  }

  .yir-calendar-media {
    display: block;
    text-decoration: none;
    color: #fff;
  }

  .yir-logo-wrapper {
    .yir-calendar-logo {
      max-width: 70%;
      width: 300px;
    }
  }

  .yir-calendar-title {
    font-size: 40px;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
    margin: 0;

    @include for-mobile {
      font-size: 32px;
      padding: 0 15px;
    }
  }

  .yir-calendar-episode {
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
    margin: 10px 0 0 0;
    font-size: 22px;

    @include for-mobile {
      font-size: 16px;
      padding: 0 15px;
    }
  }

  .yir-calendar-date {
    display: inline-grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
    align-items: center;
    gap: 0 10px;
    margin-top: 60px;
    line-height: 1.2;
  }

  .yir-calendar-icon {
    grid-row: 1 / 3;
    display: flex;
    align-items: center;
    color: #fff;
    opacity: 0.7;

    :global(svg) {
      width: 36px;
      height: 36px;
    }
  }

  .yir-calendar-month {
    text-transform: uppercase;
    font-size: 17px;
    font-weight: bold;
    text-align: left;
  }

  .yir-calendar-time {
    font-size: 17px;
    text-align: left;
    padding-top: 2px;
  }
</style>
