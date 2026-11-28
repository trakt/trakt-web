<script lang="ts">
  import "../shared/topicLayers.css";
  import "./duneThreeDecor.css";
  import { bindRootProperties } from "../shared/bindRootProperties.ts";
  import { decorateDune } from "./decorateDune.ts";
  import DesertBackdrop from "./DesertBackdrop.svelte";
  import DuneChrome from "./DuneChrome.svelte";
  import DuneStinger from "./DuneStinger.svelte";
  import HouseDossier from "./HouseDossier.svelte";
  import { ornithopterCursor } from "./ornithopterCursor.ts";
  import { createWormSign } from "./createWormSign.ts";

  const wormSign = createWormSign();

  $effect(() => {
    wormSign.start();
    return () => wormSign.stop();
  });

  $effect(() => decorateDune());

  $effect(() =>
    bindRootProperties({
      "--dn3-cursor": ornithopterCursor({
        hull: "#e9d3ad",
        wing: "#c79a62",
        eye: "#5fb4ff",
      }),
      "--dn3-cursor-hot": ornithopterCursor({
        hull: "#f6e7c8",
        wing: "#6fc0ff",
        eye: "#d8f0ff",
      }),
    }),
  );
</script>

<DesertBackdrop {wormSign} />
<DuneChrome {wormSign} />
<DuneStinger />
<HouseDossier />
