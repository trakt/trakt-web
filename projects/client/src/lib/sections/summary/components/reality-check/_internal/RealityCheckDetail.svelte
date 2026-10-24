<script lang="ts">
  import InlineMarkdown from "$lib/sections/components/markdown/InlineMarkdown.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { RealityCheckDetail } from "$lib/requests/models/RealityCheck.ts";
  import MarkdownText from "$lib/sections/components/markdown/MarkdownText.svelte";
  import { toTranslatedRealityCharacterKind } from "$lib/utils/formatting/string/toTranslatedRealityCharacterKind.ts";
  import InfoCard from "../../_internal/InfoCard.svelte";
  import RealityCheckClaims from "./RealityCheckClaims.svelte";

  const { detail }: { detail: RealityCheckDetail } = $props();
</script>

<div class="trakt-reality-check-detail">
  {#if detail.breakdown}
    <InfoCard variant="highlight">
      <p class="bold">{m.header_reality_real_story()}</p>
      <MarkdownText text={detail.breakdown} headings="subheading" />
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
      <ul class="reality-list">
        {#each detail.characters as character, index (index)}
          <li>
            <p>
              <span class="bold"><InlineMarkdown text={character.name} /></span>
              <span class="secondary">
                {toTranslatedRealityCharacterKind(character.kind)}
              </span>
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
      <p><InlineMarkdown text={detail.timeline} /></p>
    </InfoCard>
  {/if}

  {#if detail.leftOut.length > 0}
    <InfoCard>
      <p class="bold">{m.header_reality_left_out()}</p>
      <ul class="reality-bullets">
        {#each detail.leftOut as item, index (index)}
          <li><InlineMarkdown text={item} /></li>
        {/each}
      </ul>
    </InfoCard>
  {/if}

  {#if detail.sources.length > 0}
    <InfoCard>
      <p class="bold">{m.header_reality_sources()}</p>
      <ul class="reality-sources">
        {#each detail.sources as source, index (index)}
          <li>
            <Link href={source.url} target="_blank" rel="noopener noreferrer">
              {source.title}
            </Link>
          </li>
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

    .reality-list,
    .reality-sources {
      list-style: none;
    }

    .reality-bullets {
      padding-inline-start: var(--ni-18);
    }
  }
</style>
