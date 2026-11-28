<script lang="ts">
  import { m } from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { releaseCountdown } from "../shared/releaseCountdown.ts";
  import { TOPIC_MOVIES } from "../shared/TOPIC_MOVIES.ts";
  import { useNow } from "../shared/useNow.svelte.ts";
  import FanSplitMeter from "./FanSplitMeter.svelte";
  import SidePicker from "./SidePicker.svelte";

  const DUNE_PATH = UrlBuilder.movie(TOPIC_MOVIES.dunePartThree.slug);
  const DOOM_PATH = UrlBuilder.movie(TOPIC_MOVIES.avengersDoomsday.slug);
  const PEEK_MS = 3200;

  const now = useNow({ period: 15000 });
  let open = $state(false);
  let peek = $state(true);
  let dock = $state<HTMLElement>();

  const countdown = $derived(releaseCountdown(now.value));
  const minutes = $derived(String(countdown.minutes).padStart(2, "0"));
  const label = $derived(
    countdown.calendarDays === 1
      ? m.text_topic_dunesday_ticket_label_one({
          count: countdown.calendarDays,
        })
      : m.text_topic_dunesday_ticket_label_other({
          count: countdown.calendarDays,
        }),
  );
  const panelDate = $derived(
    countdown.calendarDays === 1
      ? m.text_topic_dunesday_panel_date_one({ count: countdown.calendarDays })
      : m.text_topic_dunesday_panel_date_other({
          count: countdown.calendarDays,
        }),
  );

  $effect(() => {
    const timer = setTimeout(() => (peek = false), PEEK_MS);
    return () => clearTimeout(timer);
  });

  $effect(() => {
    if (!open) return;
    const close = (event: Event) => {
      if (event instanceof KeyboardEvent && event.key !== "Escape") return;
      if (event.target instanceof Node && dock?.contains(event.target)) return;
      open = false;
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  });
</script>

<div class="dd-dock" bind:this={dock} data-open={open} data-peek={peek}>
  <button
    type="button"
    class="dd-ticket"
    aria-label={label}
    aria-expanded={open}
    aria-controls="dd-side-panel"
    onclick={() => (open = !open)}
  >
    <span class="dd-stub" data-world="dune" aria-hidden="true">
      <span class="dd-stub-sun"></span>
      <span class="dd-stub-kicker">{m.text_topic_dunesday_side_dune()}</span>
      <span class="dd-stub-number">{countdown.calendarDays}</span>
      <span class="dd-stub-unit">{m.text_topic_dunesday_stub_suns()}</span>
    </span>
    <span class="dd-stub" data-world="doom" aria-hidden="true">
      <span class="dd-stub-kicker">{m.text_topic_dunesday_side_doom()}</span>
      <span class="dd-stub-number">{countdown.totalHours}</span>
      <span class="dd-stub-unit">
        {m.text_topic_dunesday_stub_hours()}
        <em>{m.text_topic_dunesday_stub_minutes({ minutes })}</em>
      </span>
    </span>
  </button>

  {#if open}
    <div
      id="dd-side-panel"
      class="dd-panel"
      role="dialog"
      aria-label={m.text_topic_dunesday_name()}
    >
      <div class="dd-panel-head">
        <p class="dd-panel-title">
          <span>{m.text_topic_dunesday_title_start()}</span><span>
            {m.text_topic_dunesday_title_end()}
          </span>
        </p>
        <p class="dd-panel-date">{panelDate}</p>
      </div>
      <SidePicker />
      <FanSplitMeter />
      <div class="dd-panel-links">
        <a href={DUNE_PATH} data-world="dune">
          {m.text_topic_film_dune_part_three()}
        </a>
        <a href={DOOM_PATH} data-world="doom">
          {m.text_topic_film_avengers_doomsday()}
        </a>
      </div>
    </div>
  {/if}
</div>
