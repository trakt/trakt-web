<script lang="ts">
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import type { Snippet } from "svelte";
  import AwardsChipLink from "./_internal/AwardsChipLink.svelte";
  import { toAwardName } from "./_internal/toAwardName.ts";
  import { toPersonAwardStat } from "./_internal/toPersonAwardStat.ts";
  import { useAwards } from "./useAwards.ts";

  const { slug, leading }: { slug: string; leading?: Snippet } = $props();

  const target$ = fromRune(() => ({ type: "person" as const, slug }));
  const { badge } = useAwards(target$);

  const stat = $derived($badge ? toPersonAwardStat($badge) : null);
</script>

{#if $badge && stat}
  {@render leading?.()}
  <div
    class="trakt-person-awards-stat"
    data-align={leading ? "start" : "center"}
  >
    <span class="bold secondary">
      {toAwardName({ ceremony: $badge.ceremony, count: 2 })}
    </span>
    <AwardsChipLink
      count={stat.count}
      text={stat.text}
      isLive={$badge.isLive}
      isWin={$badge.wins > 0}
      size="small"
      align={leading ? "start" : "center"}
    />
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-person-awards-stat {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--gap-xxs);

    &[data-align="center"] {
      align-items: center;
    }
  }

  @include for-tablet-lg {
    .trakt-person-awards-stat span.bold {
      font-weight: normal;
    }
  }

  @include for-desktop {
    .trakt-person-awards-stat span.bold {
      font-weight: normal;
    }
  }
</style>
