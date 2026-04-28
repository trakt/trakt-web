<script lang="ts">
  import { getLocale, languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration.ts";
  import { toPercentage } from "$lib/utils/formatting/number/toPercentage.ts";
  import type { PulseDeltaKind } from "./models/PulseDeltaKind";

  type PulseDeltaTagProps = {
    delta: number;
    deltaKind: PulseDeltaKind;
  };

  const { delta, deltaKind }: PulseDeltaTagProps = $props();

  const lang = $derived(languageTag());
  const locale = $derived(getLocale());

  function formatAbsDelta(abs: number): string {
    if (deltaKind === "time") return toHumanDuration({ minutes: abs }, lang);
    if (deltaKind === "percentage") return toPercentage(abs / 100, locale);
    return String(abs);
  }

  const direction = $derived.by(() => {
    if (delta == null) return null;
    if (delta > 0) return "up";
    if (delta < 0) return "down";
    return "neutral";
  });

  const text = $derived.by(() => {
    if (delta == null) return null;
    const count = formatAbsDelta(Math.abs(delta));
    if (delta > 0) return `${m.text_stats_delta_up({ count })}`;
    if (delta < 0) return `${m.text_stats_delta_down({ count })}`;
    return `${m.text_stats_delta_same()}`;
  });
</script>

{#if text && direction}
  <span
    class="bold tag"
    style="color: var(--color-background-trend-{direction}-background-tag);"
  >
    {text}
  </span>
{/if}
