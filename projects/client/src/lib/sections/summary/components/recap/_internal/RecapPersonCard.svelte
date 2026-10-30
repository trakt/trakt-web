<script lang="ts">
  import { getIntlLocale, languageTag } from "$lib/features/i18n/index.ts";
  import type { RecapLine } from "$lib/requests/models/RecapLine.ts";
  import InlineMarkdown from "$lib/sections/components/markdown/InlineMarkdown.svelte";
  import InfoCard from "../../_internal/InfoCard.svelte";
  import RecapFace from "./RecapFace.svelte";

  const { line }: { line: RecapLine } = $props();

  const listFormat = new Intl.ListFormat(getIntlLocale(languageTag()), {
    type: "conjunction",
  });

  const people = $derived(line.people);
  const isGroup = $derived(people.length > 1);
  const heading = $derived(
    listFormat.format(people.map(({ character, name }) => character ?? name)),
  );
  const hasCharacter = $derived(people.some(({ character }) => character));
  const subheading = $derived(
    hasCharacter ? listFormat.format(people.map(({ name }) => name)) : "",
  );
</script>

<div class="trakt-recap-person-card" data-layout={isGroup ? "group" : "single"}>
  <InfoCard size="compact" fill>
    <div class="person-header">
      <span class="person-faces">
        {#each people as person (person.key)}
          <RecapFace
            name={person.character ?? person.name}
            headshot={person.headshot}
            size={isGroup ? "small" : "normal"}
          />
        {/each}
      </span>

      <span class="person-names">
        <span class="bold person-heading">{heading}</span>
        {#if subheading}
          <span class="small secondary person-subheading">{subheading}</span>
        {/if}
      </span>
    </div>

    <p class="small secondary person-state">
      <InlineMarkdown text={line.text} />
    </p>
  </InfoCard>
</div>

<style lang="scss">
  .trakt-recap-person-card {
    display: grid;
    min-width: 0;

    &[data-layout="group"] {
      grid-column: 1 / -1;
    }

    .person-header {
      display: flex;
      align-items: center;
      gap: var(--ni-10);
      min-width: 0;
    }

    .person-faces {
      display: flex;
      flex-shrink: 0;

      :global(.trakt-recap-face + .trakt-recap-face) {
        margin-inline-start: calc(-1 * var(--ni-10));
      }
    }

    .person-names {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .person-heading {
      line-height: var(--ni-18);
      overflow-wrap: anywhere;
    }

    .person-subheading {
      line-height: var(--ni-16);
      overflow-wrap: anywhere;
    }

    .person-state {
      line-height: var(--ni-18);

      :global(.trakt-inline-markdown) {
        font-size: inherit;
      }
    }
  }
</style>
