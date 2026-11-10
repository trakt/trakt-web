<script lang="ts">
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import AwardsChipLink from "./_internal/AwardsChipLink.svelte";
  import { toAwardLabel } from "./_internal/toAwardLabel.ts";
  import type { AwardsTarget } from "./models/AwardsTarget.ts";
  import { useAwards } from "./useAwards.ts";

  const { type, slug }: AwardsTarget = $props();

  const target$ = fromRune(() => ({ type, slug }));
  const { badge } = useAwards(target$);

  const label = $derived($badge ? toAwardLabel($badge) : null);
</script>

{#if $badge && label}
  <AwardsChipLink
    count={label.count}
    text={label.text}
    isLive={$badge.isLive}
    isWin={$badge.wins > 0}
  />
{/if}
