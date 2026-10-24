<script lang="ts">
  import InlineMarkdown from "$lib/sections/components/markdown/InlineMarkdown.svelte";
  import SegmentMeter from "$lib/components/meter/SegmentMeter.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { RealityCheck } from "$lib/requests/models/RealityCheck.ts";
  import type { RealityTier } from "$lib/requests/models/RealityTier.ts";
  import { toTranslatedRealityTier } from "$lib/utils/formatting/string/toTranslatedRealityTier.ts";
  import { toRealitySegments } from "$lib/utils/reality/toRealitySegments.ts";

  type Row = {
    name: string;
    caption: string | null;
    tier: RealityTier;
  };

  const { realityCheck }: { realityCheck: RealityCheck } = $props();

  const rows = $derived<Row[]>([
    {
      name: m.label_reality_row_story(),
      caption: null,
      tier: realityCheck.story,
    },
    ...realityCheck.protagonists.map(({ name, tier }) => ({
      name,
      caption: m.label_reality_row_protagonist(),
      tier,
    })),
  ]);
</script>

<ul class="trakt-reality-check-rows">
  {#each rows as row, index (index)}
    <li class="reality-row" data-tier={row.tier}>
      <div class="reality-row-who">
        <p class="bold ellipsis"><InlineMarkdown text={row.name} /></p>
        {#if row.caption}
          <p class="small secondary ellipsis">{row.caption}</p>
        {/if}
      </div>

      <div class="reality-row-meter">
        {#if row.tier === "unclear"}
          <span class="reality-unclear-badge" aria-hidden="true">?</span>
        {:else}
          <SegmentMeter filled={toRealitySegments(row.tier)} />
        {/if}
      </div>

      <span class="small bold reality-row-label">
        {toTranslatedRealityTier(row.tier)}
      </span>
    </li>
  {/each}
</ul>

<style lang="scss">
  .trakt-reality-check-rows {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    margin: 0;
    padding: 0;
    list-style: none;

    .reality-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) var(--ni-40) var(--ni-96);
      align-items: center;
      column-gap: var(--gap-xs);
      min-height: var(--ni-32);
    }

    .reality-row-who {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .reality-row-meter {
      display: flex;
      align-items: center;
    }

    .reality-row-label {
      white-space: nowrap;
      color: var(--color-text-primary);
    }

    .reality-unclear-badge {
      display: grid;
      place-items: center;

      width: var(--ni-16);
      height: var(--ni-16);

      font-size: var(--font-size-tag);
      font-weight: 600;

      color: var(--color-text-secondary);
      background: color-mix(
        in srgb,
        var(--color-text-primary) 12%,
        transparent
      );
      border-radius: 50%;
    }
  }
</style>
