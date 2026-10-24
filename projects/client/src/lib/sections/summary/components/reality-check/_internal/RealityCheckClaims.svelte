<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { RealityClaim } from "$lib/requests/models/RealityCheck.ts";
  import InlineMarkdown from "$lib/sections/components/markdown/InlineMarkdown.svelte";
  import RealityClaimLabel from "./RealityClaimLabel.svelte";

  const { claims }: { claims: RealityClaim[] } = $props();
</script>

<ul class="trakt-reality-check-claims">
  {#each claims as claim, index (index)}
    <li class="reality-claim">
      <div class="reality-claim-header">
        <RealityClaimLabel label={claim.label} impact={claim.impact} />
        {#if claim.about}
          <p class="small secondary ellipsis">
            <InlineMarkdown text={claim.about} />
          </p>
        {/if}
      </div>
      <p>
        <span class="bold">{m.label_reality_on_screen()}</span>
        <InlineMarkdown text={claim.onScreen} />
      </p>
      <p>
        <span class="bold">{m.label_reality_documented()}</span>
        <InlineMarkdown text={claim.documented} />
      </p>
    </li>
  {/each}
</ul>

<style lang="scss">
  .trakt-reality-check-claims {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    margin: 0;
    padding: 0;
    list-style: none;

    .reality-claim {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xxs);

      &:not(:first-child) {
        padding-top: var(--gap-m);
        border-top: var(--border-thickness-xxs) solid var(--color-border);
      }
    }

    .reality-claim-header {
      display: flex;
      align-items: center;
      gap: var(--gap-xs);
      min-width: 0;
    }

    p {
      font-size: var(--font-size-text);
    }
  }
</style>
