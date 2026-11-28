<script lang="ts">
  import { m } from "$lib/features/i18n/messages.ts";
  import { dunesdayState } from "./dunesdayState.svelte.ts";
  import { duneShare } from "./duneShare.ts";

  const share = $derived(duneShare(dunesdayState.split, dunesdayState.side));
  const split = $derived(dunesdayState.split);
  const note = $derived(
    split.source === "history"
      ? m.text_topic_dunesday_meter_history({
          plays: split.plays,
          dune: split.dune,
          doom: split.doom,
        })
      : m.text_topic_dunesday_meter_cosmetic(),
  );
</script>

<div
  class="dd-meter"
  data-source={split.source}
  style:--dd-share={`${share}%`}
  role="meter"
  aria-label={m.text_topic_dunesday_meter_label()}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={share}
  aria-valuetext={m.text_topic_dunesday_meter_value({
    dune: share,
    doom: 100 - share,
  })}
>
  <div class="dd-meter-labels" aria-hidden="true">
    <span class="dd-meter-label" data-world="dune">
      <b>{share}%</b>
      {m.text_topic_dunesday_side_dune()}
    </span>
    <span class="dd-meter-label" data-world="doom">
      {m.text_topic_dunesday_side_doom()} <b>{100 - share}%</b>
    </span>
  </div>
  <div class="dd-meter-rope" aria-hidden="true">
    <span class="dd-meter-fill" data-world="dune"></span>
    <span class="dd-meter-fill" data-world="doom"></span>
    <span class="dd-meter-knot"></span>
  </div>
  <p class="dd-meter-note">{note}</p>
</div>
