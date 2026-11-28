<script lang="ts">
  import { m } from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { releaseCountdown } from "../shared/releaseCountdown.ts";
  import { TOPIC_MOVIES } from "../shared/TOPIC_MOVIES.ts";
  import { sigilMarkup } from "./sigilMarkup.ts";

  const FILM_PATH = UrlBuilder.movie(TOPIC_MOVIES.avengersDoomsday.slug);

  const { placement = "rail" }: { placement?: "rail" | "dock" } = $props();

  let now = $state(Date.now());

  const countdown = $derived(releaseCountdown(now));
  const pad = (value: number) => String(value).padStart(2, "0");
  const groups = $derived([
    {
      unit: "D",
      label: m.text_topic_doom_unit_days(),
      value: pad(countdown.wholeDays),
    },
    {
      unit: "H",
      label: m.text_topic_doom_unit_hours(),
      value: pad(countdown.hours),
    },
    {
      unit: "M",
      label: m.text_topic_doom_unit_minutes(),
      value: pad(countdown.minutes),
    },
    {
      unit: "S",
      label: m.text_topic_doom_unit_seconds(),
      value: pad(countdown.seconds),
    },
  ]);
  const label = $derived(
    countdown.calendarDays === 1
      ? m.text_topic_doom_countdown_label_one({ count: countdown.calendarDays })
      : m.text_topic_doom_countdown_label_other({
          count: countdown.calendarDays,
        }),
  );

  const sigil = sigilMarkup({ seed: 77, variant: "ring" });

  $effect(() => {
    const state = { timer: setTimeout(() => {}, 0) };
    const schedule = () => {
      state.timer = setTimeout(
        () => {
          now = Date.now();
          schedule();
        },
        1000 - (Date.now() % 1000) + 8,
      );
    };
    schedule();
    return () => clearTimeout(state.timer);
  });
</script>

<a
  class="doom-countdown"
  data-placement={placement}
  href={FILM_PATH}
  aria-label={label}
  data-prefix={m.text_topic_doom_countdown_prefix()}
>
  <span class="doom-countdown-sigil" aria-hidden="true">{@html sigil}</span>
  <span class="doom-countdown-caption" aria-hidden="true">
    <span class="doom-countdown-kicker">
      <i class="doom-countdown-dot"></i>{m.text_topic_doom_countdown_kicker()}
    </span>
    <span class="doom-countdown-date">
      {m.text_topic_doom_countdown_date()}
    </span>
  </span>
  <span class="doom-countdown-clock" aria-hidden="true">
    {#each groups as group (group.unit)}
      <span class="doom-countdown-group" data-unit={group.unit}>
        {#each group.value.split("") as digit, index (index)}
          <span class="doom-digit">
            {#key digit}
              <span class="doom-digit-face" data-digit={digit}>{digit}</span>
            {/key}
          </span>
        {/each}
        <span class="doom-countdown-unit">{group.label}</span>
      </span>
    {/each}
  </span>
</a>
