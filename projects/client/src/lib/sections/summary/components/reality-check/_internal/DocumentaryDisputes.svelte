<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { DocumentaryDispute } from "$lib/requests/models/DocumentaryCheck.ts";
  import { toTranslatedDocumentarySource } from "$lib/utils/formatting/string/toTranslatedDocumentarySource.ts";
  import RealityChip from "./RealityChip.svelte";

  const IMPACT_ORDER: Record<DocumentaryDispute["impact"], number> = {
    major: 0,
    minor: 1,
  };

  const { disputes }: { disputes: DocumentaryDispute[] } = $props();

  const ordered = $derived(
    disputes.toSorted((a, b) => IMPACT_ORDER[a.impact] - IMPACT_ORDER[b.impact]),
  );
</script>

<section class="trakt-documentary-disputes">
  <h3 class="disputes-label">{m.header_documentary_disputed_claims()}</h3>

  <ul class="disputes-list">
    {#each ordered as dispute, index (index)}
      <li class="dispute" data-impact={dispute.impact}>
        <div class="dispute-header">
          <span class="dispute-source">
            <RealityChip
              text={toTranslatedDocumentarySource(dispute.type)}
              tone="neutral"
              muted={dispute.impact === "minor"}
            />
            {#if dispute.impact === "minor"}
              <span class="small secondary">{m.text_reality_claim_minor()}</span>
            {/if}
          </span>
          {#if dispute.year !== null}
            <span class="dispute-year small secondary">{dispute.year}</span>
          {/if}
        </div>
        <dl class="dispute-text">
          <dt>{m.label_documentary_claim_film_says()}</dt>
          <dd class="claim">{dispute.claim}</dd>
          <dt>{m.label_documentary_claim_disputed_by()}</dt>
          <dd class="by">{dispute.by}</dd>
          {#if dispute.reply !== null}
            <dt>{m.label_documentary_claim_reply()}</dt>
            <dd class="reply">{dispute.reply}</dd>
          {/if}
        </dl>
      </li>
    {/each}
  </ul>
</section>

<style lang="scss">
  .trakt-documentary-disputes {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    .disputes-label {
      font-size: var(--ni-11);
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--color-text-secondary);
    }

    .disputes-list {
      display: flex;
      flex-direction: column;

      margin: 0;
      margin-top: var(--gap-xs);
      padding: 0;
      list-style: none;
    }

    .dispute {
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

    .dispute-header {
      display: flex;
      align-items: center;
      gap: var(--gap-xs);
      min-width: 0;
    }

    .dispute-source {
      display: inline-flex;
      align-items: center;
      gap: var(--gap-xs);
    }

    .dispute-year {
      margin-inline-start: auto;
    }

    .dispute-text {
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
        overflow-wrap: anywhere;
      }

      .claim {
        font-size: var(--font-size-text-small);
        color: color-mix(in srgb, var(--color-text-secondary) 70%, transparent);
      }

      .by {
        font-size: var(--font-size-text);
        color: var(--color-text-primary);
      }

      .reply {
        font-size: var(--font-size-text-small);
        color: var(--color-text-secondary);
      }
    }

    .dispute[data-impact="minor"] .dispute-text {
      .claim {
        font-size: var(--font-size-tag);
      }

      .by {
        font-size: var(--font-size-text-small);
        color: color-mix(in srgb, var(--color-text-primary) 80%, transparent);
      }
    }
  }
</style>
