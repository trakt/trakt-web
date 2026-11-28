<script lang="ts">
  import { m } from "$lib/features/i18n/messages.ts";
  import { dunesdayState } from "./dunesdayState.svelte.ts";
  import { duneShare } from "./duneShare.ts";
  import FanSplitMeter from "./FanSplitMeter.svelte";
  import SidePicker from "./SidePicker.svelte";
  import { sideVerdict } from "./sideVerdict.ts";

  const split = $derived(dunesdayState.split);
  const verdict = $derived(sideVerdict(duneShare(split, dunesdayState.side)));
</script>

<section
  class="dd-side-card"
  data-verdict={verdict.side}
  aria-label={m.text_topic_dunesday_side_card_label()}
>
  <div class="dd-side-card-body">
    <p class="dd-side-card-kicker">
      <span class="dd-lockup-word" data-world="dune">
        {m.text_topic_dunesday_side_card_kicker_start()}
      </span>
      <span class="dd-lockup-word" data-world="doom">
        {m.text_topic_dunesday_side_card_kicker_end()}
      </span>
    </p>
    <p class="dd-side-card-verdict">{verdict.title}</p>
    <p class="dd-side-card-line">{verdict.line}</p>
  </div>
  <dl class="dd-side-card-stats">
    <div data-world="dune">
      <dt>{m.text_topic_dunesday_side_card_sci_fi_plays()}</dt>
      <dd>{split.dune}</dd>
    </div>
    <div data-world="doom">
      <dt>{m.text_topic_dunesday_side_card_superhero_plays()}</dt>
      <dd>{split.doom}</dd>
    </div>
    <div>
      <dt>{m.text_topic_dunesday_side_card_sampled()}</dt>
      <dd>{split.plays}</dd>
    </div>
  </dl>
  <div class="dd-side-card-controls">
    <FanSplitMeter />
    <SidePicker />
  </div>
</section>
