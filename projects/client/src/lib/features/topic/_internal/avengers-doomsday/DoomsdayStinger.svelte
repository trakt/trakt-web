<script lang="ts">
  import { dayUnitLabel } from "../shared/dayUnitLabel.ts";
  import { m } from "$lib/features/i18n/messages.ts";
  import { releaseCountdown } from "../shared/releaseCountdown.ts";
  import { useStinger } from "../shared/useStinger.svelte.ts";
  import { sigilMarkup } from "./sigilMarkup.ts";

  const DURATION = 1450;
  const EXIT = 260;

  const { calendarDays, released } = releaseCountdown(Date.now());
  const headline = released
    ? m.text_topic_doom_stinger_here()
    : m.text_topic_doom_stinger_in();
  const dayLabel = dayUnitLabel(calendarDays);
  const sigil = sigilMarkup({ seed: 1218 });
  const stinger = useStinger({
    seenKey: "doomsday-stinger",
    holdFor: DURATION,
    exitFor: EXIT,
  });
</script>

{#if stinger.phase !== "idle"}
  <div
    class="doom-stinger"
    class:is-leaving={stinger.phase === "leaving"}
    class:is-calm={stinger.calm}
    role="presentation"
    aria-hidden="true"
  >
    <div class="doom-stinger-surge"></div>
    <div class="doom-stinger-ring"></div>
    <div class="doom-stinger-sigil">{@html sigil}</div>
    <div class="doom-stinger-copy">
      <span class="doom-stinger-kicker">{headline}</span>
      {#if !released}
        <span class="doom-stinger-days">
          <span class="doom-stinger-number">{calendarDays}</span>
          <span class="doom-stinger-unit">{dayLabel}</span>
        </span>
      {/if}
      <span class="doom-stinger-foot">{m.text_topic_doom_stinger_foot()}</span>
    </div>
    <div class="doom-stinger-scan"></div>
  </div>
{/if}
