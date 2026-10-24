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
      <dl class="reality-claim-text">
        <dt>{m.label_reality_claim_on_screen()}</dt>
        <dd class="on-screen">
          <InlineMarkdown text={claim.onScreen} />
        </dd>
        <dt>{m.label_reality_claim_reality()}</dt>
        <dd class="documented">
          <InlineMarkdown text={claim.documented} />
        </dd>
      </dl>
    </li>
  {/each}
</ul>

<style lang="scss">
  .trakt-reality-check-claims {
    display: flex;
    flex-direction: column;

    margin: 0;
    margin-top: var(--gap-xs);
    padding: 0;
    list-style: none;

    .reality-claim {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xs);

      padding-block: var(--ni-18);

      &:first-child {
        padding-top: 0;
      }

      &:last-child {
        padding-bottom: 0;
      }

      &:not(:first-child) {
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

    .reality-claim-text {
      display: grid;
      grid-template-columns: max-content 1fr;
      align-items: baseline;
      gap: var(--gap-xs) var(--ni-10);

      margin: 0;

      dt {
        font-size: var(--ni-11);
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--color-text-secondary);
      }

      dd {
        margin: 0;
        line-height: 1.6;

        :global(.trakt-inline-markdown) {
          font-size: inherit;
        }
      }

      .on-screen {
        font-size: var(--font-size-text-small);
        color: color-mix(in srgb, var(--color-text-secondary) 70%, transparent);
      }

      .documented {
        font-size: var(--font-size-text);
        color: var(--color-text-primary);
      }
    }
  }
</style>
