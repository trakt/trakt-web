<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import type { YirDetail } from "$lib/requests/models/YirDetail";
  import Yir2024PageInner from "./_internal/Yir2024PageInner.svelte";
  import Yir2024PlayCard from "./_internal/Yir2024PlayCard.svelte";
  import Yir2024TopSection from "./_internal/Yir2024TopSection.svelte";

  const {
    detail,
    slug,
    year,
  }: {
    detail: YirDetail;
    slug: string;
    year: number;
  } = $props();
</script>

<div class="yir-2024">
  <Yir2024TopSection {detail} {slug} {year} />

  <p class="yir-2024-pending">More sections coming soon&hellip;</p>

  {#if detail.lastWatched}
    <Yir2024PageInner>
      <Yir2024PlayCard
        item={detail.lastWatched}
        headerLabel={m.yir_2024_last_play_of({ year })}
      />
    </Yir2024PageInner>
  {/if}
</div>

<style lang="scss">
  // Parent-driven vertical rhythm via --content-gap so children don't carry
  // margins for inter-section spacing.
  .yir-2024 {
    --content-gap: var(--ni-72);

    display: flex;
    flex-direction: column;
    gap: var(--content-gap);
    background-color: var(--shade-950);
    color: var(--shade-10);
  }

  .yir-2024-pending {
    margin: 0;
    padding: var(--ni-20);
    text-align: center;
    color: var(--shade-500);
  }
</style>
