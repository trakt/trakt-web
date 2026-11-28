<script lang="ts">
  import "../shared/topicLayers.css";
  import "./avengersDoomsdayDecor.css";
  import { decorateDoomsday } from "./decorateDoomsday.ts";
  import DoomsdayBackdrop from "./DoomsdayBackdrop.svelte";
  import DoomsdayCountdown from "./DoomsdayCountdown.svelte";
  import DoomsdayReticle from "./DoomsdayReticle.svelte";
  import DoomsdayStinger from "./DoomsdayStinger.svelte";

  $effect(() => decorateDoomsday());
</script>

<DoomsdayBackdrop />
<DoomsdayCountdown />
<DoomsdayReticle />
<DoomsdayStinger />
