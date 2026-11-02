<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { useReviewBanners } from "../_internal/useReviewBanners.ts";
  import MonthInReviewPill from "./_internal/MonthInReviewPill.svelte";

  const { mir } = useReviewBanners(new Date());
</script>

<RenderFor audience="vip" device={["tablet-lg", "desktop"]} input={["mouse"]}>
  {#if $mir.isVisible}
    <MonthInReviewPill
      month={$mir.month}
      hiddenUntil={$mir.hiddenUntil}
      onDismiss={$mir.dismiss}
    />
  {/if}
</RenderFor>
