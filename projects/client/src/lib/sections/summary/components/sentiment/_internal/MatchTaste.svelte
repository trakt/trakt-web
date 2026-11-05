<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MatchTasteProps } from "./MatchTasteProps.ts";

  const { taste }: MatchTasteProps = $props();
</script>

{#if taste.length > 0}
  <section class="trakt-match-taste">
    <p class="bold">{m.header_match_taste()}</p>
    <ul class="taste-chips">
      {#each taste as { slug, label } (slug)}
        <li class="taste-chip secondary tag bold">{label}</li>
      {/each}
    </ul>
  </section>
{/if}

<style>
  .trakt-match-taste {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    .taste-chips {
      display: flex;
      flex-wrap: wrap;
      gap: var(--gap-xs);

      margin: 0;
      padding: 0;
      list-style: none;
    }

    .taste-chip {
      display: inline-flex;
      align-items: center;

      height: var(--ni-24);
      padding: 0 var(--gap-s);

      border: var(--ni-1) solid var(--color-border);
      border-radius: var(--border-radius-pill);

      white-space: nowrap;
    }
  }
</style>
