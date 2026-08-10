<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { useMediaAwards } from "../../awards/useMediaAwards";
  import SummaryHeaderAwards from "./_internal/SummaryHeaderAwards.svelte";

  /*
    The full awards list, alone - what the glance strip's trophy opens. The
    header and the at-a-glance drawer show a capped slice of the same rows;
    this is the uncapped view, and (until the real endpoint ships) the deepest
    one there is.
  */
  const {
    slug,
    onClose,
  }: {
    slug: string;
    onClose: () => void;
  } = $props();

  const { awards } = $derived(useMediaAwards({ slug }));
</script>

<Drawer title={m.header_awards()} {onClose}>
  <div class="trakt-awards-drawer">
    <SummaryHeaderAwards {awards} />
  </div>
</Drawer>

<style lang="scss">
  .trakt-awards-drawer {
    display: flex;
    flex-direction: column;
  }
</style>
