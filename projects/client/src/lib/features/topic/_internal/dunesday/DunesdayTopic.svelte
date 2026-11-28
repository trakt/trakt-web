<script lang="ts">
  import "../shared/topicLayers.css";
  import "./dunesdayDecor.css";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import { bindRootProperties } from "../shared/bindRootProperties.ts";
  import { compassReticleCursor } from "./compassReticleCursor.ts";
  import { decorateDunesday } from "./decorateDunesday.ts";
  import DoubleTicket from "./DoubleTicket.svelte";
  import { dunesdayState } from "./dunesdayState.svelte.ts";
  import DunesdayStinger from "./DunesdayStinger.svelte";
  import SeamBackdrop from "./SeamBackdrop.svelte";
  import { useFanSplit } from "./useFanSplit.ts";

  const SIDE_ATTRIBUTE = "data-dd-side";

  const fanSplit = useFanSplit();
  const { track } = useTrack(AnalyticsEvent.TopicSide);
  const picked = { side: dunesdayState.side };

  $effect(() => {
    const { side } = dunesdayState;
    if (side === picked.side) return;
    picked.side = side;
    track({ side });
  });

  $effect(() => {
    const subscription = fanSplit.subscribe((split) => {
      dunesdayState.split = split;
    });
    return () => subscription.unsubscribe();
  });

  $effect(() => {
    const root = document.documentElement;
    root.setAttribute(SIDE_ATTRIBUTE, dunesdayState.side);
    return () => root.removeAttribute(SIDE_ATTRIBUTE);
  });

  $effect(() =>
    bindRootProperties({
      "--dd-cursor": compassReticleCursor({
        sand: "#f3c77e",
        emerald: "#62f5a8",
      }),
      "--dd-cursor-lock": compassReticleCursor({
        sand: "#ffe2a8",
        emerald: "#9dffcb",
        locked: true,
      }),
    }),
  );

  $effect(() => decorateDunesday());
</script>

<svg class="dd-defs" aria-hidden="true" width="0" height="0">
  <defs>
    <linearGradient id="dd-star-gradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f3c77e" />
      <stop offset="0.5" stop-color="#f3c77e" />
      <stop offset="0.5" stop-color="#62f5a8" />
      <stop offset="1" stop-color="#2fc77f" />
    </linearGradient>
  </defs>
</svg>

<SeamBackdrop />
<DoubleTicket />
<DunesdayStinger />
