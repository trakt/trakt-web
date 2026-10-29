<script lang="ts">
  import InlineMarkdown from "$lib/sections/components/markdown/InlineMarkdown.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { RealityCheckDetail } from "$lib/requests/models/RealityCheck.ts";
  import MarkdownText from "$lib/sections/components/markdown/MarkdownText.svelte";
  import { toTranslatedRealityCharacterKind } from "$lib/utils/formatting/string/toTranslatedRealityCharacterKind.ts";
  import InfoCard from "../../_internal/InfoCard.svelte";
  import RealityCheckClaims from "./RealityCheckClaims.svelte";
  import RealityChip from "./RealityChip.svelte";
  import type { RealityChipProps } from "./RealityChipProps.ts";

  type CharacterKind = RealityCheckDetail["characters"][number]["kind"];

  const KIND_TONE: Record<CharacterKind, RealityChipProps["tone"]> = {
    real: "accurate",
    composite: "adjusted",
    invented: "altered",
  };

  const { detail }: { detail: RealityCheckDetail } = $props();
</script>

<div class="trakt-reality-check-detail">
  {#if detail.breakdown}
    <InfoCard variant="highlight">
      <p class="bold">{m.header_reality_real_story()}</p>
      <div class="reality-breakdown">
        <MarkdownText
          text={detail.breakdown}
          headings="subheading"
          spacing="relaxed"
        />
      </div>
    </InfoCard>
  {/if}

  {#if detail.claims.length > 0}
    <InfoCard>
      <p class="bold">{m.header_reality_claims()}</p>
      <RealityCheckClaims claims={detail.claims} />
    </InfoCard>
  {/if}

  {#if detail.characters.length > 0}
    <InfoCard>
      <p class="bold">{m.header_reality_people()}</p>
      <ul class="reality-list reality-text">
        {#each detail.characters as character, index (index)}
          <li>
            <p class="reality-character-name">
              <span class="bold"><InlineMarkdown text={character.name} /></span>
              <RealityChip
                text={toTranslatedRealityCharacterKind(character.kind)}
                tone={KIND_TONE[character.kind]}
              />
            </p>
            <p class="small secondary">
              <InlineMarkdown text={character.note} />
            </p>
          </li>
        {/each}
      </ul>
    </InfoCard>
  {/if}

  {#if detail.timeline}
    <InfoCard>
      <p class="bold">{m.header_reality_timeline()}</p>
      <p class="reality-text"><InlineMarkdown text={detail.timeline} /></p>
    </InfoCard>
  {/if}

  {#if detail.leftOut.length > 0}
    <InfoCard>
      <p class="bold">{m.header_reality_left_out()}</p>
      <ul class="reality-bullets reality-text">
        {#each detail.leftOut as item, index (index)}
          <li><InlineMarkdown text={item} /></li>
        {/each}
      </ul>
    </InfoCard>
  {/if}
</div>

<style lang="scss">
  .trakt-reality-check-detail {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    ul {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xs);

      margin: 0;
      padding: 0;
    }

    .reality-list {
      list-style: none;
    }

    .reality-text {
      line-height: 1.6;
    }

    .reality-character-name {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      column-gap: var(--gap-xs);
    }

    .reality-bullets {
      padding-inline-start: var(--ni-18);
    }
  }
</style>
